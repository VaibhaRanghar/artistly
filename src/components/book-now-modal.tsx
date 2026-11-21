"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Textarea } from "@/src/components/ui/textarea";
import { Label } from "@/src/components/ui/label";
import { MessageCircle, CheckCircle, Loader2, X, AlertCircle, LogIn } from "lucide-react";
import { createOrder } from "@/src/lib/actions/user-actions";
import { useRouter } from "next/navigation";
import { useUser, SignInButton } from "@clerk/nextjs";

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
  const { isSignedIn, isLoaded } = useUser();

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

    if (!isSignedIn) {
      setError("UNAUTHORIZED");
      return;
    }

    setIsLoading(true);

    try {
      const result = await createOrder({
        serviceId: selectedService,
        requirements: requirements,
      });

      if (!result.success) {
        setError(result.error || "Failed to create booking. Please try again.");
        return;
      }

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
        onClick={() => {
          setError("");
          setIsOpen(true);
        }}
        className="w-full py-4 font-black text-sm uppercase tracking-wider bg-[#f5e642] text-black border-2 border-[#f5e642] hover:bg-transparent hover:text-[#f5e642] transition-colors flex items-center justify-center gap-2"
        style={{ boxShadow: "4px 4px 0px 0px #ff2a6d" }}
      >
        <MessageCircle className="h-4 w-4" />
        Request Booking
      </button>
      
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div 
            className="relative w-full max-w-[440px] bg-[#0d0d0d] border-2 border-white/20 p-6 shadow-2xl"
            style={{ boxShadow: "8px 8px 0px 0px #f5e642" }}
          >
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1.5 border border-white/20 text-white/50 hover:border-white hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
            
            <div className="mb-4">
              <p className="text-[#f5e642] font-mono text-xs uppercase tracking-widest mb-1">
                {"// booking request"}
              </p>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                {isSuccess ? "Booking Sent!" : `Book ${artistName}`}
              </h2>
            </div>

            {isSuccess ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle className="h-14 w-14 text-[#00ffcc] mx-auto animate-bounce" />
                <h3 className="text-xl font-black text-white uppercase">Request Submitted!</h3>
                <p className="text-white/70 text-sm">Your booking request has been sent to {artistName}.</p>
                <p className="text-xs text-[#00ffcc] font-mono font-bold uppercase tracking-wider">Redirecting to your orders...</p>
              </div>
            ) : (
              <form onSubmit={handleBooking} className="grid gap-4 py-2">
                {/* Not Signed In Warning Banner */}
                {isLoaded && !isSignedIn && (
                  <div 
                    className="p-4 border-2 border-[#ff2a6d] bg-[#1a0d11] text-white flex flex-col gap-2"
                    style={{ boxShadow: "4px 4px 0px 0px #ff2a6d" }}
                  >
                    <div className="flex items-center gap-2 text-[#ff2a6d] font-black text-xs uppercase tracking-wider">
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      <span>Sign In Required</span>
                    </div>
                    <p className="text-xs text-white/80 leading-relaxed">
                      You must be signed in to request bookings. Please sign in or create an account to proceed.
                    </p>
                  </div>
                )}

                <div className="grid gap-2">
                  <Label htmlFor="service" className="text-xs font-bold uppercase tracking-wider text-white/60">
                    Select Service
                  </Label>
                  <select 
                    id="service"
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="bg-[#111] border-2 border-white/10 text-white px-4 py-2.5 text-sm font-medium focus:border-[#f5e642] outline-none transition-colors w-full"
                    required
                  >
                    {services.map(s => (
                      <option key={s.id} value={s.id} className="bg-[#111] text-white">
                        {s.title} — ${Number(s.price).toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="requirements" className="text-xs font-bold uppercase tracking-wider text-white/60">
                    Event Details & Requirements
                  </Label>
                  <Textarea 
                    id="requirements" 
                    placeholder="Tell the artist about your event, date, location, and requirements..."
                    className="bg-[#111] border-2 border-white/10 text-white min-h-[90px] focus:border-[#f5e642] outline-none transition-colors resize-none text-sm"
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                  />
                </div>

                {/* Themed Error Message */}
                {error && (
                  <div 
                    className="p-3.5 border-2 border-[#ff2a6d] bg-[#1a0d11] text-white flex flex-col gap-2"
                    style={{ boxShadow: "3px 3px 0px 0px #ff2a6d" }}
                  >
                    <div className="flex items-center gap-2 text-[#ff2a6d] font-black text-xs uppercase tracking-wider">
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      <span>
                        {error === "UNAUTHORIZED" 
                          ? "Authentication Required" 
                          : error === "NOT_ONBOARDED" 
                          ? "Profile Setup Required" 
                          : "Booking Request Failed"}
                      </span>
                    </div>
                    <p className="text-xs text-white/80 leading-relaxed">
                      {error === "UNAUTHORIZED" ? (
                        "You must be signed in to book this artist. Please sign in or create an account."
                      ) : error === "NOT_ONBOARDED" ? (
                        "Please complete your account onboarding before booking."
                      ) : (
                        error
                      )}
                    </p>
                  </div>
                )}

                {/* Primary Button */}
                {isLoaded && !isSignedIn ? (
                  <SignInButton mode="modal">
                    <button
                      type="button"
                      className="mt-2 w-full py-3.5 font-black uppercase tracking-wider text-sm bg-[#f5e642] text-black border-2 border-[#f5e642] hover:bg-transparent hover:text-[#f5e642] transition-colors flex items-center justify-center gap-2"
                      style={{ boxShadow: "4px 4px 0px 0px #ff2a6d" }}
                    >
                      <LogIn className="h-4 w-4" />
                      Sign In to Request Booking
                    </button>
                  </SignInButton>
                ) : (
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="mt-2 w-full py-6 font-black uppercase tracking-wider text-sm bg-[#f5e642] text-black border-2 border-[#f5e642] hover:bg-transparent hover:text-[#f5e642] transition-colors flex items-center justify-center gap-2 rounded-none"
                    style={{ boxShadow: "4px 4px 0px 0px #00ffcc" }}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting Request...
                      </>
                    ) : (
                      "Submit Booking Request"
                    )}
                  </Button>
                )}
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
