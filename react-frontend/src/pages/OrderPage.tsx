import { useEffect } from "react"
import { useForm } from "react-hook-form";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { type DeliveryFormValues } from "@/features/cart/CartContext";
import { useCart } from "@/features/cart/useCart";
import { useAddress } from "@/features/address/useAddress";
import { useSettings } from "@/features/settings/useSettings";

import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Recenter = ({ lat, lng }: { lat: number; lng: number }) => {
    const map = useMap();
    useEffect(() => {map.setView([lat, lng], 15)}, [lat, lng, map]);
    return null;
};

const OrderPage = () => {
    const { items, totalItems, totalPrice, handleCheckout } = useCart();
    const { query, results, lat, lng, searchAddress, selectAddress } = useAddress();
    const { settings } = useSettings();
    const { formState, register, watch, setValue, handleSubmit } = useForm<DeliveryFormValues>({ mode: "onBlur", defaultValues: { lat, lng, address: "" }});

    const markerIcon = new L.Icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
    });
    const isDarkMode = settings.darkMode !== null ? settings.darkMode : window.matchMedia("(prefers-color-scheme: dark)").matches;

    useEffect(() => {window.scrollTo({ top: 0, behavior: "auto" })}, []);

    useEffect(() => {
        if (lat !== watch("lat")) setValue("lat", lat);
        if (lng !== watch("lng")) setValue("lng", lng);
        if (query !== watch("address")) setValue("address", query);
    }, [lat, lng, query, setValue, watch]);

    const onSubmit = async (data: DeliveryFormValues) => {
        const confirmed = window.confirm("Are you sure you want to place this order?");
        if (!confirmed) return;
        await handleCheckout(data);
    };

    return (
        <>
            <Header />
            <main className="w-full min-h-[var(--main-height)] bg-gradient-subtle flex flex-col items-center">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="w-3/4 mx-auto my-6 grid grid-cols-1 lg:grid-cols-3 gap-6"
                >
                    <section className="lg:col-span-2 space-y-6">
                        {items.length > 0 && (
                            <ul className="space-y-4">
                                {items.map((item, index) => (
                                    <li key={index}>
                                        <ProductCard variant="compact" product={item} />
                                    </li>
                                ))}
                            </ul>
                        )}

                        <Input
                            id="full-name"
                            placeholder="Full name"
                            {...register("fullName", { required: true })}
                            required
                        />

                        <section>
                            <Input
                                id="address-search"
                                placeholder="Search delivery address"
                                value={query}
                                onChange={(e) => searchAddress(e.target.value)}
                                required
                            />

                            {results.length > 0 && (
                                <menu className="border border-border rounded-md bg-background max-h-60 overflow-auto">
                                    {results.map((r) => (
                                        <li
                                            key={r.place_id}
                                            className="px-3 py-2 text-sm hover:bg-muted cursor-pointer"
                                            onClick={() => selectAddress(r)}
                                        >
                                            {r.display_name}
                                        </li>
                                    ))}
                                </menu>
                            )}
                        </section>

                        <figure className="w-full h-[320px] rounded-md overflow-hidden border border-border">
                            <MapContainer
                                center={[lat, lng]}
                                zoom={15}
                                scrollWheelZoom={false}
                                doubleClickZoom={false}
                                dragging={false}
                                zoomControl={false}
                                touchZoom={false}
                                keyboard={false}
                                boxZoom={false}
                                attributionControl={false}
                                className="h-full w-full"
                            >
                                {isDarkMode ? (
                                    <TileLayer
                                        attribution="© Stadia Maps, © OpenStreetMap contributors"
                                        url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
                                    />
                                ) : (
                                    <TileLayer
                                        attribution="© OpenStreetMap contributors"
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                )}
                                <Marker position={[lat, lng]} icon={markerIcon} />
                                <Recenter lat={lat} lng={lng} />
                            </MapContainer>
                        </figure>
                    </section>

                    <aside className="border border-border rounded-md p-6 h-fit space-y-4 bg-background">
                        <h2 className="text-xl text-foreground font-light">Order summary</h2>

                        <p className="flex justify-between text-sm text-muted-foreground">
                            <span>Items</span>
                            <span>{totalItems}</span>
                        </p>

                        <p className="flex justify-between text-lg text-foreground font-light">
                            <span>Total</span>
                            <strong className="font-bold">${totalPrice.toFixed(2)}</strong>
                        </p>

                        <Button
                            type="submit"
                            disabled={formState.isSubmitting}
                            className="w-full text-lg"
                        >
                            PLACE YOUR ORDER
                        </Button>
                    </aside>
                </form>
            </main>
        </>
    );
};

export default OrderPage;