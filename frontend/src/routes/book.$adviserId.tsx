import { useState } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  CalendarPlus,
  Check,
  CreditCard,
  Loader2,
  Video,
} from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/site/Logo";
import { Avatar } from "@/components/site/Badges";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { advisers, formatBDT, getAdviser } from "@/data/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/book/$adviserId")({
  head: () => ({
    meta: [
      { title: "Book a consultation — Mentora" },
      {
        name: "description",
        content: "Select a date, time slot, service topic and complete your session booking.",
      },
      { property: "og:title", content: "Book a consultation — Mentora" },
      { property: "og:description", content: "Secure per-session booking with verified advisers." },
    ],
  }),
  component: BookingFlow,
});

const steps = ["Service", "Date & time", "Notes", "Review", "Payment"];
const days = ["Sun 2 Aug", "Mon 3 Aug", "Tue 4 Aug", "Wed 5 Aug", "Thu 6 Aug"];
const times = ["6:00 PM", "7:00 PM", "8:30 PM", "9:30 PM", "10:30 PM"];

function BookingFlow() {
  const { adviserId } = useParams({ from: "/book/$adviserId" });
  const adviser = getAdviser(adviserId) ?? advisers[0]!;
  const [step, setStep] = useState(0);
  const [serviceId, setServiceId] = useState(adviser.services[0]!.id);
  const [day, setDay] = useState(days[1]!);
  const [time, setTime] = useState(times[1]!);
  const [notes, setNotes] = useState("");
  const [paying, setPaying] = useState(false);
  const [done, setDone] = useState(false);

  const service = adviser.services.find((s) => s.id === serviceId)!;
  const total = service.price + 50;

  const pay = () => {
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      setDone(true);
      toast.success("Booking confirmed", { description: `${service.name} with ${adviser.name}` });
    }, 1600);
  };

  if (done) {
    return (
      <div className="min-h-screen bg-surface">
        <Header />
        <main className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
          <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-card">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-success/10 text-success">
              <Check className="h-7 w-7" />
            </span>
            <h1 className="mt-5 text-2xl font-extrabold text-foreground">Your consultation is confirmed</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              A confirmation and meeting link have been sent to your email and dashboard.
            </p>

            <dl className="mt-8 space-y-3 rounded-xl border border-border bg-surface p-5 text-left text-sm">
              <Row label="Adviser" value={adviser.name} />
              <Row label="Service" value={service.name} />
              <Row label="Date & time" value={`${day} · ${time} (GMT+6)`} />
              <Row label="Price" value={formatBDT(total)} />
              <Row label="Meeting method" value="Google Meet video call" />
            </dl>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button variant="outline" className="flex-1" onClick={() => toast("Added to your calendar")}>
                <CalendarPlus className="mr-1 h-4 w-4" /> Add to calendar
              </Button>
              <Button asChild className="flex-1">
                <Link to="/dashboard">Go to dashboard</Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <Header />
      <main className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div>
          <p className="label-caps text-primary">
            Step {step + 1} of {steps.length} · {steps[step]}
          </p>
          <Progress value={((step + 1) / steps.length) * 100} className="mt-3 h-1.5" />

          <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-card">
            {step === 0 && (
              <div className="space-y-3">
                <h2 className="text-lg font-extrabold text-foreground">Select a service</h2>
                {adviser.services.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setServiceId(s.id)}
                    aria-pressed={serviceId === s.id}
                    className={cn(
                      "flex w-full items-start justify-between gap-4 rounded-xl border p-4 text-left transition-all",
                      serviceId === s.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40",
                    )}
                  >
                    <span className="min-w-0">
                      <span className="block text-sm font-bold text-foreground">{s.name}</span>
                      <span className="mt-1 block text-xs text-muted-foreground">
                        {s.duration} · {s.description}
                      </span>
                    </span>
                    <span className="shrink-0 text-sm font-extrabold text-primary">{formatBDT(s.price)}</span>
                  </button>
                ))}
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-lg font-extrabold text-foreground">Select date and time</h2>
                <div>
                  <Label className="label-caps text-muted-foreground">Date</Label>
                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
                    {days.map((d) => (
                      <Chip key={d} label={d} active={day === d} onClick={() => setDay(d)} />
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="label-caps text-muted-foreground">Time (GMT+6)</Label>
                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
                    {times.map((t) => (
                      <Chip key={t} label={t} active={time === t} onClick={() => setTime(t)} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-3">
                <h2 className="text-lg font-extrabold text-foreground">Consultation notes</h2>
                <Label htmlFor="notes" className="text-sm text-muted-foreground">
                  What should your adviser prepare before the call?
                </Label>
                <Textarea
                  id="notes"
                  rows={6}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="CGPA 3.45 from AIUB, targeting Winter 2027 intake in Germany for MSc Data Science. IELTS 7.0. Need help choosing between Uni-Assist and direct applications."
                />
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-lg font-extrabold text-foreground">Review your booking</h2>
                <dl className="mt-5 space-y-3 text-sm">
                  <Row label="Adviser" value={adviser.name} />
                  <Row label="Service" value={service.name} />
                  <Row label="Duration" value={service.duration} />
                  <Row label="Date & time" value={`${day} · ${time}`} />
                  <Row label="Notes" value={notes ? "Added" : "None"} />
                  <Row label="Total" value={formatBDT(total)} />
                </dl>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-5">
                <h2 className="text-lg font-extrabold text-foreground">Payment</h2>
                <div className="rounded-xl border border-dashed border-border bg-surface p-4 text-xs text-muted-foreground">
                  Prototype payment step — bKash, Nagad and card payments will be connected here. No real
                  charge is made.
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="card">Card number</Label>
                    <Input id="card" placeholder="4242 4242 4242 4242" className="h-11" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="exp">Expiry</Label>
                    <Input id="exp" placeholder="09 / 28" className="h-11" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input id="cvc" placeholder="123" className="h-11" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 flex items-center justify-between gap-3">
            <Button
              variant="outline"
              disabled={step === 0 || paying}
              onClick={() => setStep((s) => Math.max(0, s - 1))}
            >
              <ArrowLeft className="mr-1 h-4 w-4" /> Back
            </Button>
            <Button
              className="min-w-40"
              disabled={paying}
              onClick={() => (step === steps.length - 1 ? pay() : setStep((s) => s + 1))}
            >
              {paying ? (
                <>
                  <Loader2 className="mr-1 h-4 w-4 animate-spin" /> Processing
                </>
              ) : step === steps.length - 1 ? (
                <>
                  <CreditCard className="mr-1 h-4 w-4" /> Pay {formatBDT(total)}
                </>
              ) : (
                <>
                  Continue <ArrowRight className="ml-1 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>

        <aside>
          <div className="sticky top-6 rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center gap-3">
              <Avatar initials={adviser.photo} size="sm" />
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-foreground">{adviser.name}</p>
                <p className="truncate text-xs text-muted-foreground">{adviser.specialisation}</p>
              </div>
            </div>
            <dl className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
              <Row label="Service" value={service.name} />
              <Row label="When" value={`${day}, ${time}`} />
              <Row label="Session fee" value={formatBDT(service.price)} />
              <Row label="Platform fee" value={formatBDT(50)} />
              <div className="flex justify-between border-t border-border pt-2">
                <dt className="font-bold text-foreground">Total</dt>
                <dd className="font-extrabold text-foreground">{formatBDT(total)}</dd>
              </div>
            </dl>
            <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <Video className="h-3.5 w-3.5 text-primary" /> Online video consultation
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}

function Header() {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <Logo />
        <Link to="/advisers" className="text-sm font-medium text-muted-foreground hover:text-primary">
          Back to advisers
        </Link>
      </div>
    </header>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium text-foreground">{value}</dd>
    </div>
  );
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-xl border px-3 py-2.5 text-xs font-semibold transition-all",
        active ? "border-primary bg-primary/5 text-primary" : "border-border text-foreground hover:border-primary/40",
      )}
    >
      {label}
    </button>
  );
}