import { ShieldAlert } from "lucide-react";

export function Disclaimer() {
  return (
    <section className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-amber-950">
      <div className="flex gap-3">
        <ShieldAlert aria-hidden="true" className="mt-1 shrink-0" size={22} />
        <p className="leading-7">
          Narzędzie edukacyjne wskazuje podejrzane sygnały, ale może się mylić. Niski wynik nie gwarantuje bezpieczeństwa. W razie wątpliwości zadzwoń do banku pod oficjalny numer lub zgłoś sprawę odpowiednim służbom.
        </p>
      </div>
    </section>
  );
}
