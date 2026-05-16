"use client";

import { useState } from "react";
import { Mail, Phone, Plus, Trash2, Users } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { storageKeys } from "@/lib/storage";
import type { TrustedContact } from "@/lib/types";

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function TrustedContactsPage() {
  const [contacts, setContacts] = useLocalStorage<TrustedContact[]>(storageKeys.trustedContacts, []);
  const [form, setForm] = useState<Omit<TrustedContact, "id">>({
    name: "",
    relation: "",
    phone: "",
    email: "",
    preferredContactMethod: "Phone"
  });

  const addContact = () => {
    if (!form.name.trim()) {
      return;
    }

    setContacts([{ id: createId(), ...form, name: form.name.trim(), relation: form.relation.trim() }, ...contacts]);
    setForm({ name: "", relation: "", phone: "", email: "", preferredContactMethod: "Phone" });
  };

  const deleteContact = (id: string) => {
    setContacts(contacts.filter((contact) => contact.id !== id));
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white p-6 shadow-soft">
        <p className="font-bold text-tealguard">Local trusted contacts</p>
        <h1 className="mt-2 text-3xl font-black text-ink sm:text-4xl">Trusted contacts</h1>
        <p className="mt-3 max-w-3xl text-slate-600">
          Save trusted people locally in this browser. No account is required and contacts are not uploaded anywhere.
          Use placeholder data if you only want to demo the feature.
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-3xl border border-teal-100 bg-white p-6 shadow-soft">
          <h2 className="flex items-center gap-2 text-2xl font-black text-ink">
            <Plus aria-hidden="true" className="text-tealguard" size={24} />
            Add contact
          </h2>
          <div className="mt-5 grid gap-4">
            <label className="block">
              <span className="text-sm font-black text-ink">Name</span>
              <input
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                className="mt-2 min-h-12 w-full rounded-2xl border border-slate-200 px-4 focus:border-tealguard focus:outline-none focus:ring-4 focus:ring-teal-200"
              />
            </label>
            <label className="block">
              <span className="text-sm font-black text-ink">Relation</span>
              <input
                value={form.relation}
                onChange={(event) => setForm({ ...form, relation: event.target.value })}
                placeholder="Daughter, son, neighbor, caregiver"
                className="mt-2 min-h-12 w-full rounded-2xl border border-slate-200 px-4 focus:border-tealguard focus:outline-none focus:ring-4 focus:ring-teal-200"
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-black text-ink">Phone</span>
                <input
                  value={form.phone}
                  onChange={(event) => setForm({ ...form, phone: event.target.value })}
                  className="mt-2 min-h-12 w-full rounded-2xl border border-slate-200 px-4 focus:border-tealguard focus:outline-none focus:ring-4 focus:ring-teal-200"
                />
              </label>
              <label className="block">
                <span className="text-sm font-black text-ink">Email</span>
                <input
                  value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                  className="mt-2 min-h-12 w-full rounded-2xl border border-slate-200 px-4 focus:border-tealguard focus:outline-none focus:ring-4 focus:ring-teal-200"
                />
              </label>
            </div>
            <label className="block">
              <span className="text-sm font-black text-ink">Preferred contact method</span>
              <select
                value={form.preferredContactMethod}
                onChange={(event) =>
                  setForm({ ...form, preferredContactMethod: event.target.value as TrustedContact["preferredContactMethod"] })
                }
                className="mt-2 min-h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 focus:border-tealguard focus:outline-none focus:ring-4 focus:ring-teal-200"
              >
                <option>Phone</option>
                <option>SMS</option>
                <option>WhatsApp</option>
                <option>Messenger</option>
                <option>Email</option>
              </select>
            </label>
            <button
              type="button"
              onClick={addContact}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-tealguard px-5 py-3 font-black text-white shadow-soft hover:bg-ocean focus:outline-none focus:ring-4 focus:ring-teal-200"
            >
              <Plus aria-hidden="true" size={20} />
              Save contact locally
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-teal-100 bg-white p-6 shadow-soft">
          <h2 className="flex items-center gap-2 text-2xl font-black text-ink">
            <Users aria-hidden="true" className="text-tealguard" size={24} />
            Saved contacts
          </h2>
          {contacts.length === 0 ? (
            <div className="mt-5">
              <EmptyState
                icon={Users}
                title="No trusted contacts yet"
                description="Add one trusted person so the family-help generator can prepare a more personal message."
              />
            </div>
          ) : (
            <div className="mt-5 grid gap-4">
              {contacts.map((contact) => (
                <article key={contact.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-black text-ink">{contact.name}</h3>
                      <p className="mt-1 text-sm font-semibold text-tealguard">{contact.relation || "Trusted contact"}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteContact(contact.id)}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-red-100 bg-white text-red-700 hover:bg-red-50 focus:outline-none focus:ring-4 focus:ring-red-100"
                      aria-label={`Delete ${contact.name}`}
                    >
                      <Trash2 aria-hidden="true" size={18} />
                    </button>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-600">
                    {contact.phone && (
                      <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2">
                        <Phone aria-hidden="true" size={16} />
                        {contact.phone}
                      </span>
                    )}
                    {contact.email && (
                      <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2">
                        <Mail aria-hidden="true" size={16} />
                        {contact.email}
                      </span>
                    )}
                    <span className="rounded-full bg-teal-50 px-3 py-2 font-bold text-tealguard">
                      {contact.preferredContactMethod}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
