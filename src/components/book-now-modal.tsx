"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Textarea } from "@/src/components/ui/textarea";
import { Label } from "@/src/components/ui/label";
import { MessageCircle, CheckCircle, Loader2, X } from "lucide-react";
import { createOrder } from "@/src/lib/actions/user-actions";
import { useRouter } from "next/navigation";

interface Service {
  id: string;
  title: string;
  price: any;
  category: string;
}

interface BookNowModalProps {
  artistId: string;
  artistName: string;
  services: Service[];
}

export function BookNowModal({ artistId, artistName, services }: BookNowModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string>(services[0]?.id || "");
  const [requirements, setRequirements] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  if (services.length === 0) {
    return (
      <button 
        disabled
        className="w-full py-4 font-black text-sm uppercase tracking-wider bg-[#333] text-white/50 border-2 border-[#333] transition-colors flex items-center justify-center gap-2"
        style={{ boxShadow: "4px 4px 0px 0px #1a1a1a" }}
      >
        No Services Available
      </button>
    );
  }

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await createOrder({
        serviceId: selectedService,
        requirements: requirements,
      });
      setIsSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        router.push("/dashboard/hirer/orders");
      }, 2000);
    } catch (err: any) {
      setError("Failed to create booking. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full py-4 font-black text-sm uppercase tracking-wider bg-[#f5e642] text-black border-2 border-[#f5e642] hover:bg-transparent hover:text-[#f5e642] transition-colors flex items-center justify-center gap-2"
        style={{ boxShadow: "4px 4px 0px 0px #ff2a6d" }}
      >
        <MessageCircle className="h-4 w-4" />
        Request Booking
      </button>
      
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-[425px] bg-[#0d0d0d] border border-white/10 p-6 shadow-xl">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="mb-4">
              <h2 className="text-xl font-bold font-mono text-[#f5e642]">
                {isSuccess ? "Booking Requested!" : `Book ${artistName}`}
              </h2>
            </div>

            {isSuccess ? (
              <div className="py-6 text-center">
                <CheckCircle className="h-12 w-12 text-[#00ffcc] mx-auto mb-4" />
                <p className="text-white/80">Your booking request has been sent.</p>
                <p className="text-sm text-white/50 mt-2">Redirecting to your orders...</p>
              </div>
            ) : (
              <form onSubmit={handleBooking} className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="service" className="text-white/80">Select Service</Label>
                  <select 
                    id="service"
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-white/10 bg-[#111] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#f5e642]"
                    required
                  >
                    {services.map(s => (
                      <option key={s.id} value={s.id} className="bg-[#111]">
                        {s.title} - ${Number(s.price).toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="requirements" className="text-white/80">Event Details & Requirements</Label>
                  <Textarea 
                    id="requirements" 
                    placeholder="Tell the artist about your event, date, location, and any special requests..."
                    className="col-span-3 bg-[#111] border-white/10 text-white min-h-[100px] focus:border-[#f5e642]"
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                  />
                </div>

                {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="mt-4 w-full font-bold uppercase tracking-wider bg-[#f5e642] text-black hover:bg-[#f5e642]/80"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending Request...
                    </>
                  ) : (
                    "Submit Request"
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
