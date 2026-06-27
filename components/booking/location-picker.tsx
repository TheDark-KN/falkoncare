"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"
import { toast } from "sonner"

function isNCRCovered(addressText: string, pin: string): boolean {
  const cleanPin = pin.trim();
  const cleanAddress = addressText.toLowerCase();

  const ncrPincodePatterns = [
    /^11/,       // Delhi (110001-110096)
    /^201/,      // Noida / Ghaziabad (201001-201310)
    /^122/,      // Gurgaon (122001-122108)
    /^121/,      // Faridabad (121001-121012)
  ];

  const ncrKeywords = ["delhi", "noida", "gurgaon", "gurugram", "ghaziabad", "faridabad"];

  const pinMatches = cleanPin ? ncrPincodePatterns.some(p => p.test(cleanPin)) : false;
  const keywordMatches = ncrKeywords.some(k => cleanAddress.includes(k));

  return pinMatches || keywordMatches;
}

interface LocationPickerProps {
  onLocationSelect: (
    address: string,
    pincode?: string,
    lat?: number,
    lng?: number,
    source?: "live" | "manual"
  ) => void
  initialAddress?: string
  initialLat?: number
  initialLng?: number
  initialSource?: "live" | "manual"
}

export function LocationPicker({
  onLocationSelect,
  initialAddress = "",
  initialLat,
  initialLng,
  initialSource = "manual",
}: LocationPickerProps) {
  const [address, setAddress] = useState(initialAddress)
  const [pincode, setPincode] = useState("")
  const [latitude, setLatitude] = useState<number | null>(initialLat || null)
  const [longitude, setLongitude] = useState<number | null>(initialLng || null)
  const [locationSource, setLocationSource] = useState<"live" | "manual">(initialSource)

  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [leafletLoaded, setLeafletLoaded] = useState(false)

  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)
  const markerInstance = useRef<any>(null)

  // Reverse geocoding (OpenStreetMap Nominatim) - declared early and wrapped in useCallback
  const reverseGeocode = useCallback(async (lat: number, lng: number, source: "live" | "manual") => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      )
      if (!response.ok) throw new Error("Reverse geocoding error")
      const data = await response.json()

      if (data.display_name) {
        const detectedAddress = data.display_name
        let postcode = ""
        if (data.address?.postcode) {
          postcode = data.address.postcode
        }
        
        if (!isNCRCovered(detectedAddress, postcode)) {
          toast.warning("⚠️ We don't currently serve this area. We cover Delhi, Noida, Gurgaon, Ghaziabad, and Faridabad.")
          setAddress("")
          setPincode("")
          onLocationSelect("", undefined, undefined, undefined, source)
          return
        }

        setAddress(detectedAddress)
        setPincode(postcode)
        onLocationSelect(detectedAddress, postcode || undefined, lat, lng, source)
      }
    } catch (error) {
      console.error("Reverse geocoding failed:", error)
      toast.error("Failed to retrieve address details. Address text remains editable.")
    }
  }, [onLocationSelect])

  // Helper: update marker position and map center
  const updateMapLocation = useCallback((lat: number, lng: number) => {
    if (mapInstance.current && markerInstance.current) {
      markerInstance.current.setLatLng([lat, lng])
      mapInstance.current.setView([lat, lng], 15)
    }
  }, [])

  // Dynamically load Leaflet CDN scripts and styles
  useEffect(() => {
    // Check if script is already present
    if (window.hasOwnProperty("L")) {
      setLeafletLoaded(true)
      return
    }

    const cssId = "leaflet-cdn-css"
    if (!document.getElementById(cssId)) {
      const link = document.createElement("link")
      link.id = cssId
      link.rel = "stylesheet"
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      document.head.appendChild(link)
    }

    const scriptId = "leaflet-cdn-js"
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script")
      script.id = scriptId
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
      script.async = true
      script.onload = () => {
        setLeafletLoaded(true)
      }
      script.onerror = () => {
        console.error("Failed to load Leaflet CDN")
        toast.error("Failed to load map assets. Fallback to manual entry is active.")
      }
      document.body.appendChild(script)
    } else {
      setLeafletLoaded(true)
    }
  }, [])

  // Initialize Map
  useEffect(() => {
    if (!leafletLoaded || !mapRef.current || mapInstance.current) return

    const L = (window as any).L
    if (!L) return

    // Standard starting center: Delhi NCR
    const startLat = latitude || 28.6139
    const startLng = longitude || 77.2090

    try {
      const map = L.map(mapRef.current, {
        center: [startLat, startLng],
        zoom: 13,
        zoomControl: true,
      })

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map)

      const marker = L.marker([startLat, startLng], {
        draggable: true,
      }).addTo(map)

      mapInstance.current = map
      markerInstance.current = marker

      // Set initial values if they exist
      if (latitude && longitude) {
        setLatitude(latitude)
        setLongitude(longitude)
      } else {
        setLatitude(startLat)
        setLongitude(startLng)
      }

      // Marker drag handler
      marker.on("dragend", async () => {
        const position = marker.getLatLng()
        const newLat = position.lat
        const newLng = position.lng
        setLatitude(newLat)
        setLongitude(newLng)
        setLocationSource("manual")
        await reverseGeocode(newLat, newLng, "manual")
      })

      // Click on map handler
      map.on("click", async (e: any) => {
        const newLat = e.latlng.lat
        const newLng = e.latlng.lng
        marker.setLatLng([newLat, newLng])
        setLatitude(newLat)
        setLongitude(newLng)
        setLocationSource("manual")
        await reverseGeocode(newLat, newLng, "manual")
      })
    } catch (err) {
      console.error("Map initialization failed:", err)
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove()
        mapInstance.current = null
        markerInstance.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leafletLoaded])

  // Address search autocompletion (Nominatim Search)
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&limit=1`
      )
      if (!response.ok) throw new Error("Search failed")
      const data = await response.json()

      if (data && data.length > 0) {
        const firstResult = data[0]
        const lat = parseFloat(firstResult.lat)
        const lng = parseFloat(firstResult.lon)
        const displayName = firstResult.display_name || ""

        let postcode = ""
        const pinMatch = displayName.match(/\b\d{6}\b/)
        if (pinMatch) {
          postcode = pinMatch[0]
        }

        if (!isNCRCovered(displayName, postcode)) {
          toast.warning("⚠️ We don't currently serve this area. We cover Delhi, Noida, Gurgaon, Ghaziabad, and Faridabad.")
          setIsSearching(false)
          return
        }

        setLatitude(lat)
        setLongitude(lng)
        setLocationSource("manual")
        updateMapLocation(lat, lng)

        await reverseGeocode(lat, lng, "manual")
        toast.success("Location pinned!")
      } else {
        toast.error("Location not found. Try searching with a landmark or city.")
      }
    } catch (error) {
      console.error("Search query failed:", error)
      toast.error("Address search failed. Please pin manually.")
    } finally {
      setIsSearching(false)
    }
  }

  // Live geolocation detection with high-accuracy to low-accuracy fallback
  const handleGetCurrentLocation = () => {
    setIsGettingLocation(true)
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser")
      setIsGettingLocation(false)
      return
    }

    const options = { 
      enableHighAccuracy: true, 
      timeout: 15000, 
      maximumAge: 0 
    }

    navigator.geolocation.getCurrentPosition(
      async (position: GeolocationPosition) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude

        setLatitude(lat)
        setLongitude(lng)
        setLocationSource("live")
        updateMapLocation(lat, lng)
        await reverseGeocode(lat, lng, "live")

        toast.success("Live location detected!")
        setIsGettingLocation(false)
      },
      (error) => {
        console.error("Geolocation error:", error)
        let errorMsg = "Unable to retrieve your precise location. Please pin it manually on the map."
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = "Location access denied. Please check your browser permissions or enter your address manually."
        } else if (error.code === error.TIMEOUT) {
          errorMsg = "Location request timed out. Please try again or pin your location manually."
        }
        toast.error(errorMsg)
        setIsGettingLocation(false)
      },
      options
    )
  }

  // Handle manual confirmations
  const handleManualSubmit = () => {
    if (!address.trim()) {
      toast.error("Please enter or select a service address")
      return
    }
    if (!isNCRCovered(address, pincode)) {
      toast.warning("⚠️ We don't currently serve this area. We cover Delhi, Noida, Gurgaon, Ghaziabad, and Faridabad.")
      return
    }
    onLocationSelect(
      address,
      pincode || undefined,
      latitude || undefined,
      longitude || undefined,
      locationSource
    )
    toast.success("Location details confirmed!")
  }

  return (
    <Card className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 shadow-sm shadow-sky-900/5 rounded-2xl overflow-hidden relative">
      <CardHeader className="border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between py-5">
        <CardTitle className="text-base font-bold text-sky-900 dark:text-white font-headline flex items-center gap-2">
          <Icons.mapPin className="w-5 h-5 text-primary" />
          Service Location Picker
        </CardTitle>
        {latitude && longitude && (
          <div className="flex gap-2">
            <span className="text-[9px] px-2 py-0.5 bg-sky-50 dark:bg-slate-855 text-sky-700 dark:text-sky-300 border border-sky-100/50 dark:border-slate-700 rounded-full font-bold font-headline capitalize">
              {locationSource} Location
            </span>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-6 md:p-8 space-y-6">
        {/* Search input bar */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Icons.search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search area, society, landmark, or sector..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 bg-slate-50 dark:bg-slate-800 border-none rounded-xl font-headline text-sm font-semibold h-12"
              disabled={isSearching}
            />
          </div>
          <Button
            type="submit"
            disabled={isSearching || !searchQuery.trim()}
            className="h-12 px-6 rounded-xl font-headline font-bold text-sm bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-100 dark:bg-slate-800 dark:text-sky-300 dark:border-slate-750"
          >
            {isSearching ? (
              <Icons.loader className="w-4 h-4 animate-spin" />
            ) : (
              "Find"
            )}
          </Button>
        </form>

        {/* Dynamic Leaflet Map Area */}
        <div className="grid md:grid-cols-5 gap-6">
          <div className="md:col-span-3 space-y-3">
            <div
              ref={mapRef}
              id="location-map"
              className="w-full h-[280px] bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-inner z-10 relative overflow-hidden"
            />
            <p className="text-[10px] text-slate-400 font-bold text-center font-headline">
              ✓ Drag the red pin or click anywhere on the map to mark your water tank location
            </p>
          </div>

          <div className="md:col-span-2 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Geolocation trigger */}
              <Button
                type="button"
                variant="outline"
                onClick={handleGetCurrentLocation}
                disabled={isGettingLocation}
                className="w-full h-12 rounded-xl font-headline font-bold text-sm border-2 border-primary/20 hover:border-primary text-primary hover:bg-primary/5 active:scale-95 duration-200 flex items-center justify-center gap-2"
              >
                {isGettingLocation ? (
                  <>
                    <Icons.loader className="w-4 h-4 animate-spin" />
                    Detecting Coordinates...
                  </>
                ) : (
                  <>
                    <Icons.phone className="w-4 h-4 rotate-45" />
                    Detect Live Location
                  </>
                )}
              </Button>

              {/* Editable Street Address text */}
              <div className="space-y-1.5">
                <Label htmlFor="street-address" className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider font-headline">Street Address / Landmark</Label>
                <Input
                  id="street-address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street name, house/flat no., society"
                  className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-semibold h-11"
                  required
                />
              </div>

              {/* PIN Code */}
              <div className="space-y-1.5">
                <Label htmlFor="pincode-picker" className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider font-headline">PIN Code (6 Digits)</Label>
                <Input
                  id="pincode-picker"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="e.g. 110001"
                  maxLength={6}
                  className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-semibold h-11"
                />
              </div>

              {/* Latitude/Longitude Display */}
              {latitude && longitude && (
                <div className="p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 rounded-xl flex items-center justify-between text-[10px] font-semibold text-slate-500 font-headline">
                  <span>Coordinates:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">
                    {latitude.toFixed(5)}, {longitude.toFixed(5)}
                  </span>
                </div>
              )}
            </div>

            <Button
              type="button"
              disabled={!address.trim()}
              onClick={handleManualSubmit}
              className="w-full h-12 bg-primary hover:bg-primary/95 text-white font-headline font-bold text-sm rounded-xl active:scale-95 duration-200 border-0 flex items-center justify-center gap-1.5 shadow-lg shadow-primary/10 mt-2"
            >
              <Icons.check className="w-4 h-4" />
              Confirm Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
