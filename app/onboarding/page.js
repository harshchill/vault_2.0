"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Building2, BookOpenText, Sparkles, GraduationCap, Gift, Ticket, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const fadeInUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.22, 0.61, 0.36, 1] },
  }),
};

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, status, update } = useSession();

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [loadingReferral, setLoadingReferral] = useState(false);

  const [serverError, setServerError] = useState("");
  const [profileMessage, setProfileMessage] = useState("");
  const [referralMessage, setReferralMessage] = useState("");
  const [referralError, setReferralError] = useState("");

  const [hasRedeemedReferral, setHasRedeemedReferral] = useState(false);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [myReferralCode, setMyReferralCode] = useState("");

  const [form, setForm] = useState({
    university: "",
    program: "",
    specialization: "",
    semester: "",
    referralCode: "",
  });

  const semesterOptions = useMemo(() => Array.from({ length: 12 }, (_, idx) => idx + 1), []);

  const fetchOnboardingState = useCallback(async () => {
    setLoadingProfile(true);
    setServerError("");

    try {
      const response = await fetch("/api/onboarding", { cache: "no-store" });
      const data = await response.json();

      if (!response.ok) {
        setServerError(data?.error || "Could not load onboarding details.");
        return;
      }

      setIsOnboarded(Boolean(data?.isOnboarded));
      setHasRedeemedReferral(Boolean(data?.hasRedeemedReferral));
      setMyReferralCode(data?.referralCode || "");

      setForm((previous) => ({
        ...previous,
        university: data?.profile?.university || "",
        program: data?.profile?.program || "",
        specialization: data?.profile?.specialization || "",
        semester: data?.profile?.semester ? String(data.profile.semester) : "",
      }));

      if (data?.isOnboarded) {
        router.replace("/");
      }
    } catch (error) {
      console.error(error);
      setServerError("Could not load onboarding details.");
    } finally {
      setLoadingProfile(false);
    }
  }, [router]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/login?callbackUrl=/onboarding");
      return;
    }

    if (status === "authenticated") {
      void fetchOnboardingState();
    }
  }, [status, router, fetchOnboardingState]);

  async function handleComplete(action) {
    setLoadingComplete(true);
    setServerError("");
    setProfileMessage("");

    try {
      const payload = {
        action,
        university: form.university,
        program: form.program,
        specialization: form.specialization,
        semester: form.semester,
      };

      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setServerError(data?.error || "Unable to complete onboarding.");
        return;
      }

      await update();
      setProfileMessage(
        data?.alreadyOnboarded
          ? "Onboarding already completed."
          : `Onboarding completed. ${data?.coinsAdded || 0} coins added.`
      );

      setTimeout(() => {
        router.replace("/user/browse");
      }, 750);
    } catch (error) {
      console.error(error);
      setServerError("Unable to complete onboarding.");
    } finally {
      setLoadingComplete(false);
    }
  }

  async function handleRedeemReferral() {
    setLoadingReferral(true);
    setReferralMessage("");
    setReferralError("");

    try {
      const response = await fetch("/api/referral/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referralCode: form.referralCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        setReferralError(data?.error || "Could not redeem referral code.");
        return;
      }

      await update();
      setHasRedeemedReferral(true);
      setForm((previous) => ({ ...previous, referralCode: "" }));
      setReferralMessage(`Referral redeemed. ${data?.coinsAdded || 0} coins added.`);
    } catch (error) {
      console.error(error);
      setReferralError("Could not redeem referral code.");
    } finally {
      setLoadingReferral(false);
    }
  }

  if (loadingProfile || status === "loading") {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(160deg, #F7F0F0 0%, #eef5ec 60%, #F7F0F0 100%)" }}
      >
        <div className="flex items-center gap-2 text-sm" style={{ color: "#25671E" }}>
          <Loader2 size={18} className="animate-spin" />
          Loading onboarding...
        </div>
      </div>
    );
  }

  if (!session?.user || isOnboarded) {
    return null;
  }

  return (
    <div
      className="relative min-h-screen px-4 py-12 sm:px-6 lg:px-10"
      style={{ background: "linear-gradient(160deg, #F7F0F0 0%, #eef5ec 60%, #F7F0F0 100%)" }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(#25671E 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-5xl">
        <motion.div
          className="text-center"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold"
            style={{
              background: "rgba(72, 161, 17, 0.12)",
              border: "1px solid rgba(72, 161, 17, 0.25)",
              color: "#25671E",
            }}
          >
            <Sparkles size={14} />
            Complete profile and claim rewards
          </div>

          <h1 className="mt-5 text-3xl sm:text-4xl font-bold" style={{ color: "#25671E" }}>
            Welcome to Vault, {session.user.name?.split(" ")?.[0] || "Student"}
          </h1>
          <p className="mt-3 text-sm sm:text-base" style={{ color: "#25671E", opacity: 0.65 }}>
            Finish onboarding to unlock your first 100 coins. Have a referral code? Redeem it for an extra 50.
          </p>
        </motion.div>

        {serverError && (
          <div
            className="mt-6 rounded-xl border px-4 py-3 text-sm"
            style={{
              background: "rgba(239, 68, 68, 0.05)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              color: "#991b1b",
            }}
          >
            {serverError}
          </div>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr,1fr]">
          <motion.section
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={0.1}
            className="rounded-2xl border p-6 sm:p-8"
            style={{
              background: "white",
              border: "1px solid rgba(37, 103, 30, 0.15)",
              boxShadow: "0 8px 26px rgba(37, 103, 30, 0.08)",
            }}
          >
            <div className="flex items-center gap-2">
              <GraduationCap size={20} style={{ color: "#48A111" }} />
              <h2 className="text-lg font-semibold" style={{ color: "#25671E" }}>
                Academic Profile
              </h2>
            </div>
            <p className="mt-1 text-xs" style={{ color: "#25671E", opacity: 0.6 }}>
              Fill your details for better paper recommendations.
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field
                label="Institute / University"
                icon={<Building2 size={16} />}
                value={form.university}
                onChange={(value) => setForm((prev) => ({ ...prev, university: value }))}
                placeholder="RGPV, VTU, Mumbai University"
              />
              <Field
                label="Program / Course"
                icon={<BookOpenText size={16} />}
                value={form.program}
                onChange={(value) => setForm((prev) => ({ ...prev, program: value }))}
                placeholder="B.Tech CSE"
              />
              <Field
                label="Specialization"
                icon={<Sparkles size={16} />}
                value={form.specialization}
                onChange={(value) => setForm((prev) => ({ ...prev, specialization: value }))}
                placeholder="AI & ML"
              />

              <div>
                <label className="text-xs font-semibold block mb-2" style={{ color: "#25671E" }}>
                  Semester
                </label>
                <select
                  value={form.semester}
                  onChange={(e) => setForm((prev) => ({ ...prev, semester: e.target.value }))}
                  className="w-full rounded-lg border px-3 py-2.5 text-sm"
                  style={{
                    border: "1px solid rgba(37, 103, 30, 0.15)",
                    color: "#25671E",
                    background: "white",
                  }}
                >
                  <option value="">Select semester</option>
                  {semesterOptions.map((value) => (
                    <option key={value} value={value}>
                      Semester {value}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {profileMessage && (
              <div
                className="mt-4 rounded-lg border px-3 py-2 text-sm"
                style={{
                  background: "rgba(72, 161, 17, 0.08)",
                  border: "1px solid rgba(72, 161, 17, 0.35)",
                  color: "#25671E",
                }}
              >
                {profileMessage}
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => handleComplete("done")}
                disabled={loadingComplete}
                className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-65"
                style={{ background: "#25671E", boxShadow: "0 6px 18px rgba(37, 103, 30, 0.3)" }}
              >
                {loadingComplete ? <Loader2 size={16} className="animate-spin" /> : <Gift size={16} />}
                Done + Get 100 Coins
              </button>

              <button
                type="button"
                onClick={() => handleComplete("skip")}
                disabled={loadingComplete}
                className="inline-flex items-center justify-center rounded-full border px-6 py-2.5 text-sm font-semibold disabled:opacity-65"
                style={{
                  border: "1px solid rgba(37, 103, 30, 0.25)",
                  color: "#25671E",
                  background: "#FAF6EF",
                }}
              >
                Skip for now
              </button>
            </div>
          </motion.section>

          <motion.section
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={0.2}
            className="rounded-2xl border p-6"
            style={{
              background: "white",
              border: "1px solid rgba(37, 103, 30, 0.15)",
              boxShadow: "0 8px 26px rgba(37, 103, 30, 0.08)",
            }}
          >
            <div className="flex items-center gap-2">
              <Ticket size={20} style={{ color: "#48A111" }} />
              <h2 className="text-lg font-semibold" style={{ color: "#25671E" }}>
                Referral Bonus
              </h2>
            </div>
            <p className="mt-1 text-xs" style={{ color: "#25671E", opacity: 0.6 }}>
              Enter a valid referral code to get +50 coins for you and your friend.
            </p>

            <div
              className="mt-4 rounded-xl border px-3 py-2"
              style={{ border: "1px dashed rgba(72, 161, 17, 0.45)", background: "rgba(72, 161, 17, 0.08)" }}
            >
              <p className="text-[11px] uppercase tracking-wide" style={{ color: "#25671E", opacity: 0.65 }}>
                Your referral code
              </p>
              <p className="text-xl font-bold tracking-[0.16em] mt-1" style={{ color: "#25671E" }}>
                {myReferralCode || "Loading..."}
              </p>
            </div>

            <label className="text-xs font-semibold block mt-5 mb-2" style={{ color: "#25671E" }}>
              Redeem code
            </label>
            <input
              value={form.referralCode}
              onChange={(e) => setForm((prev) => ({ ...prev, referralCode: e.target.value.toUpperCase() }))}
              disabled={hasRedeemedReferral || loadingReferral}
              placeholder="Enter referral code"
              className="w-full rounded-lg border px-3 py-2.5 text-sm uppercase tracking-[0.08em]"
              style={{
                border: "1px solid rgba(37, 103, 30, 0.15)",
                color: "#25671E",
                background: hasRedeemedReferral ? "rgba(37, 103, 30, 0.06)" : "white",
              }}
            />

            {referralError && (
              <p className="mt-2 text-xs" style={{ color: "#991b1b" }}>
                {referralError}
              </p>
            )}
            {referralMessage && (
              <p className="mt-2 text-xs" style={{ color: "#25671E" }}>
                {referralMessage}
              </p>
            )}

            <button
              type="button"
              onClick={handleRedeemReferral}
              disabled={hasRedeemedReferral || loadingReferral || !form.referralCode.trim()}
              className="mt-4 w-full rounded-full py-2.5 text-sm font-semibold text-white disabled:opacity-60"
              style={{ background: "#48A111", boxShadow: "0 6px 18px rgba(72, 161, 17, 0.28)" }}
            >
              {loadingReferral ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  Redeeming...
                </span>
              ) : hasRedeemedReferral ? (
                "Referral Redeemed"
              ) : (
                "Redeem +50 Coins"
              )}
            </button>
          </motion.section>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, icon }) {
  return (
    <div>
      <label className="text-xs font-semibold block mb-2" style={{ color: "#25671E" }}>
        {label}
      </label>
      <div className="relative flex items-center">
        <span className="absolute left-3 pr-2.5" style={{ color: "#48A111" }}>
          {icon}
        </span>
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border py-2.5 pl-9 pr-3 text-sm"
          style={{
            border: "1px solid rgba(37, 103, 30, 0.15)",
            color: "#25671E",
            background: "white",
          }}
        />
      </div>
    </div>
  );
}
