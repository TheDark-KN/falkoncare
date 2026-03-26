"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"
import { toast } from "sonner"

interface LocationPickerProps {
    onLocationSelect: (address: string, pincode?: string) => void
    initialAddress?: string
}

export function LocationPicker({ onLocationSelect, initialAddress }: LocationPickerProps) {
    const [address, setAddress] = useState(initialAddress || "")
    const [pincode, setPincode] = useState("")
    const [isGettingLocation, setIsGettingLocation] = useState(false)

    const getCurrentLocation = () => {
        setIsGettingLocation(true)

        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser")
            setIsGettingLocation(false)
            return
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords

                try {
                    // Use reverse geocoding to get address from coordinates
                    // Using OpenStreetMap Nominatim API (free, no API key required)
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    )
                    const data = await response.json()

                    if (data.display_name) {
                        const detectedAddress = data.display_name
                        setAddress(detectedAddress)

                        // Extract pincode if available
                        if (data.address?.postcode) {
                            setPincode(data.address.postcode)
                        }

                        toast.success("Location detected successfully!")
                        onLocationSelect(detectedAddress, data.address?.postcode)
                    } else {
                        toast.error("Could not detect address from location")
                    }
                } catch (error) {
                    console.error("Geocoding error:", error)
                    toast.error("Failed to get address from location")
                } finally {
                    setIsGettingLocation(false)
                }
            },
            (error) => {
                console.error("Geolocation error:", error.message || error.code || "Permission denied")
                toast.error("Failed to get your location. Please check browser permissions.")
                setIsGettingLocation(false)
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        )
    }

    const handleManualSubmit = () => {
        if (!address.trim()) {
            toast.error("Please enter an address")
            return
        }
        onLocationSelect(address, pincode || undefined)
    }

    return (
        <Card className="glass-effect overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 dark:from-black/40 dark:to-black/10 pointer-events-none" />
            <div className="relative z-10">
                <CardHeader>
                    <CardTitle className="text-foreground">Service Location</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Current Location Button */}
                <Button
                    variant="outline"
                    className="w-full border-primary/50 hover:bg-primary/10"
                    onClick={getCurrentLocation}
                    disabled={isGettingLocation}
                >
                    {isGettingLocation ? (
                        <>
                            <Icons.loader className="w-4 h-4 mr-2 animate-spin" />
                            Detecting Location...
                        </>
                    ) : (
                        <>
                            <Icons.mapPin className="w-4 h-4 mr-2" />
                            Use Current Location
                        </>
                    )}
                </Button>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">Or enter manually</span>
                    </div>
                </div>

                {/* Manual Address Input */}
                <div className="space-y-2">
                    <Label htmlFor="address" className="text-foreground">Address</Label>
                    <Input
                        id="address"
                        placeholder="Enter your complete address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="bg-background border-input"
                    />
                </div>

                {/* PIN Code Input */}
                <div className="space-y-2">
                    <Label htmlFor="pincode" className="text-foreground">PIN Code (Optional)</Label>
                    <Input
                        id="pincode"
                        placeholder="Enter PIN code"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        maxLength={6}
                        className="bg-background border-input"
                    />
                </div>

                <Button
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={handleManualSubmit}
                    disabled={!address.trim()}
                >
                    Confirm Location
                </Button>
            </CardContent>
            </div>
        </Card>
    )
}
