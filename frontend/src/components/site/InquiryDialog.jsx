import React, { useState } from "react";
import axios from "axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Loader2, Send, CheckCircle2 } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const initialState = {
  name: "",
  email: "",
  company: "",
  phone: "",
  role: "",
  team_size: "",
  message: "",
};

export const InquiryDialog = ({ open, onOpenChange, type = "va" }) => {
  const [form, setForm] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const isTeam = type === "team";

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const reset = () => {
    setForm(initialState);
    setSuccess(false);
    setSubmitting(false);
  };

  const handleClose = (next) => {
    if (!next) {
      // delay reset slightly to avoid flash
      setTimeout(reset, 200);
    }
    onOpenChange(next);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill in your name, email and message.");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        inquiry_type: type,
        name: form.name.trim(),
        email: form.email.trim(),
        company: form.company.trim() || null,
        phone: form.phone.trim() || null,
        role: form.role.trim() || null,
        team_size: isTeam ? (form.team_size.trim() || null) : null,
        message: form.message.trim(),
      };
      const { data } = await axios.post(`${API}/inquiries`, payload);
      setSuccess(true);
      toast.success("Inquiry sent — we'll be in touch shortly.");
      // Auto-close after a moment
      setTimeout(() => handleClose(false), 1800);
      return data;
    } catch (err) {
      const msg = err?.response?.data?.detail || "Something went wrong. Please try again.";
      toast.error(typeof msg === "string" ? msg : "Could not submit inquiry.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="bg-navy-900 border border-white/10 text-white max-w-lg sm:max-w-xl rounded-2xl p-0 overflow-hidden"
        data-testid={`inquiry-dialog-${type}`}
      >
        {/* Header with accent strip */}
        <div className="relative px-6 sm:px-8 pt-7 pb-5 border-b border-white/10">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/70 to-transparent" />
          <div className="eyebrow !text-amber-400/90">
            {isTeam ? "Team Inquiry" : "Virtual Assistant Inquiry"}
          </div>
          <DialogHeader className="space-y-1 mt-2">
            <DialogTitle className="font-display text-2xl sm:text-3xl text-white tracking-tight">
              {isTeam ? "Tell us about your team needs" : "Find your perfect Virtual Assistant"}
            </DialogTitle>
            <DialogDescription className="text-white/60 text-sm">
              We'll review your details and respond within 24 hours.
            </DialogDescription>
          </DialogHeader>
        </div>

        {success ? (
          <div className="px-6 sm:px-8 py-12 text-center" data-testid="inquiry-success">
            <div className="w-14 h-14 rounded-full bg-amber-500/15 border border-amber-500/30 inline-flex items-center justify-center text-amber-400 mx-auto">
              <CheckCircle2 size={26} />
            </div>
            <h4 className="mt-4 font-display text-xl text-white">Thanks — message received.</h4>
            <p className="mt-2 text-white/60 text-sm">We'll be in touch shortly at <span className="text-white">{form.email}</span>.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="px-6 sm:px-8 py-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="iq-name" className="text-white/70 text-xs uppercase tracking-[0.15em]">Name *</Label>
                <Input
                  id="iq-name"
                  required
                  value={form.name}
                  onChange={update("name")}
                  placeholder="Jane Doe"
                  className="mt-1.5 bg-white/[0.04] border-white/10 text-white placeholder:text-white/30 focus-visible:ring-amber-500/60"
                  data-testid="inquiry-input-name"
                />
              </div>
              <div>
                <Label htmlFor="iq-email" className="text-white/70 text-xs uppercase tracking-[0.15em]">Email *</Label>
                <Input
                  id="iq-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={update("email")}
                  placeholder="you@company.com"
                  className="mt-1.5 bg-white/[0.04] border-white/10 text-white placeholder:text-white/30 focus-visible:ring-amber-500/60"
                  data-testid="inquiry-input-email"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="iq-company" className="text-white/70 text-xs uppercase tracking-[0.15em]">Company</Label>
                <Input
                  id="iq-company"
                  value={form.company}
                  onChange={update("company")}
                  placeholder="Acme Inc."
                  className="mt-1.5 bg-white/[0.04] border-white/10 text-white placeholder:text-white/30 focus-visible:ring-amber-500/60"
                  data-testid="inquiry-input-company"
                />
              </div>
              <div>
                <Label htmlFor="iq-phone" className="text-white/70 text-xs uppercase tracking-[0.15em]">Phone</Label>
                <Input
                  id="iq-phone"
                  value={form.phone}
                  onChange={update("phone")}
                  placeholder="+1 555 0100"
                  className="mt-1.5 bg-white/[0.04] border-white/10 text-white placeholder:text-white/30 focus-visible:ring-amber-500/60"
                  data-testid="inquiry-input-phone"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="iq-role" className="text-white/70 text-xs uppercase tracking-[0.15em]">
                  {isTeam ? "Roles needed" : "Role / skills"}
                </Label>
                <Input
                  id="iq-role"
                  value={form.role}
                  onChange={update("role")}
                  placeholder={isTeam ? "e.g. Designer + Editor + VA" : "e.g. Calendar + Email mgmt"}
                  className="mt-1.5 bg-white/[0.04] border-white/10 text-white placeholder:text-white/30 focus-visible:ring-amber-500/60"
                  data-testid="inquiry-input-role"
                />
              </div>
              {isTeam && (
                <div>
                  <Label htmlFor="iq-size" className="text-white/70 text-xs uppercase tracking-[0.15em]">Team size</Label>
                  <Input
                    id="iq-size"
                    value={form.team_size}
                    onChange={update("team_size")}
                    placeholder="e.g. 3-5"
                    className="mt-1.5 bg-white/[0.04] border-white/10 text-white placeholder:text-white/30 focus-visible:ring-amber-500/60"
                    data-testid="inquiry-input-team-size"
                  />
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="iq-message" className="text-white/70 text-xs uppercase tracking-[0.15em]">Tell us more *</Label>
              <Textarea
                id="iq-message"
                required
                value={form.message}
                onChange={update("message")}
                rows={4}
                placeholder="Project scope, timeline, anything we should know..."
                className="mt-1.5 bg-white/[0.04] border-white/10 text-white placeholder:text-white/30 focus-visible:ring-amber-500/60"
                data-testid="inquiry-input-message"
              />
            </div>

            <div className="flex items-center justify-between pt-2 gap-3 flex-wrap">
              <p className="text-[11px] text-white/40 max-w-xs">By submitting you agree to be contacted by WorkQuire about your inquiry.</p>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-amber-500 hover:bg-amber-600 text-navy-900 font-semibold rounded-full px-6 amber-glow"
                data-testid="inquiry-submit-btn"
              >
                {submitting ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Send size={16} className="mr-2" />}
                Send Inquiry
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default InquiryDialog;
