import bakeryStorefront from "@/assets/bakery-storefront.jpg";
import bakeryCase from "@/assets/bakery-case.jpg";
import bakeryKitchen from "@/assets/bakery-kitchen.jpg";
import bakeryInterior from "@/assets/bakery-interior.jpg";
import cakePiping from "@/assets/cake-piping.jpg";
import cakeDisplay from "@/assets/cake-display.jpg";
import dental from "@/assets/place-dental.jpg";

export type Place = {
  id: string;
  name: string;
  address: string;
  hours: string;
  rating: number;
  reviews: number;
  photos: string[];
  tags: string[];
  reason?: string;
  distance?: string;
  confirmed?: string;
  price?: string;
  lead?: string;
};

export type ChannelStep = {
  label: string;
  state: "done" | "skipped" | "active" | "next";
  detail: string;
  icon: "call" | "retry" | "message" | "email";
};

export type Task = {
  id: string;
  kind: string;
  title: string;
  brief: string;
  asmiAction: string;
  status: "needs-you" | "in-motion";
  liveLine: string;
  ago: string;
  options: Place[];
  steps: ChannelStep[];
  timeline: { time: string; event: string; state?: "done" | "skipped" | "active" }[];
  thread: { from: "asmi" | "them"; text: string; time: string }[];
  outcome?: { label: string; headline: string; detail: string; at: string };
  recording?: {
    to: string;
    at: string;
    duration: string;
    transcript: { from: "asmi" | "them"; text: string }[];
  };
};

export const tasks: Task[] = [
  {
    id: "mango-heart-cake",
    kind: "Order",
    title: "Custom mango mousse heart cake",
    brief:
      'Find a San Francisco patisserie that can make a heart-shaped mango mousse cake piped with "Love you Danny 💜" for pickup Saturday afternoon.',
    asmiAction: "",
    status: "in-motion",
    liveLine: "Order confirmed",
    ago: "4m ago",
    options: [
      {
        id: "b-patisserie",
        name: "b. Patisserie",
        address: "2821 California St, Lower Pac Heights",
        hours: "Open · Closes 6 PM",
        rating: 4.6,
        reviews: 3120,
        photos: [bakeryStorefront, bakeryCase, cakePiping, bakeryKitchen],
        tags: ["Custom message", "Heart mould", "48h notice"],
        distance: "1.4 mi",
        confirmed: "Mango mousse · Saturday 2 PM",
        price: "$68 · 6 in",
        lead: "48h notice",
      },
      {
        id: "schuberts",
        name: "Schubert's Bakery",
        address: "521 Clement St, Inner Richmond",
        hours: "Open · Closes 6:30 PM",
        rating: 4.5,
        reviews: 1860,
        photos: [cakeDisplay, bakeryInterior, bakeryCase],
        tags: ["Custom message", "Same-week"],
        distance: "3.1 mi",
        confirmed: "Mango mousse · Saturday 3 PM",
        price: "$54 · 7 in",
        lead: "24h notice",
      },
      {
        id: "noe-valley-bakery",
        name: "Noe Valley Bakery",
        address: "4073 24th St, Noe Valley",
        hours: "Open · Closes 7 PM",
        rating: 4.4,
        reviews: 1204,
        photos: [bakeryInterior, bakeryKitchen, cakeDisplay],
        tags: ["Heart mould", "Pickup only"],
        distance: "2.2 mi",
        price: "$62 · 6 in",
        lead: "72h notice",
      },
    ],
    steps: [
      { label: "Call", state: "done", detail: "3m 06s", icon: "call" },
      { label: "Retry", state: "skipped", detail: "Not needed", icon: "retry" },
      { label: "Message", state: "done", detail: "Confirmed", icon: "message" },
      { label: "Email", state: "skipped", detail: "Not needed", icon: "email" },
    ],
    timeline: [
      { time: "3:05 PM", event: "Spoke with the cake desk — 3m 06s call", state: "done" },
      { time: "3:12 PM", event: 'Message sent with the "Love you Danny 💜" piping note', state: "done" },
      { time: "3:18 PM", event: "Bakery replied confirming Saturday 2:00 PM pickup", state: "done" },
    ],
    thread: [
      {
        from: "asmi",
        text: 'Hi! Confirming the order from our call — 6" heart mango mousse cake, piped "Love you Danny 💜", pickup Saturday 2:00 PM.',
        time: "3:12 PM",
      },
      {
        from: "them",
        text: "Confirmed! Heart mould booked, Alphonso mango mousse, purple heart included. $68, pay at pickup.",
        time: "3:18 PM",
      },
      { from: "asmi", text: "Perfect — thank you! See you Saturday.", time: "3:19 PM" },
    ],
    outcome: {
      label: "Resolved",
      headline: 'b. Patisserie confirmed the heart mango mousse cake with "Love you Danny 💜" for Saturday 2:00 PM.',
      detail:
        "Asmi called the cake desk, confirmed the heart mould and Alphonso mango mousse, then locked the piping over message. $68, pay at pickup.",
      at: "Aug 17, 3:19 PM",
    },
    recording: {
      to: "+1 415 440 1700",
      at: "3:02 PM",
      duration: "3:06",
      transcript: [
        { from: "asmi", text: "Hi! I'd like a 6-inch heart-shaped mango mousse cake for Saturday pickup." },
        { from: "them", text: "We can do that — heart mould is free Saturday, Alphonso mango mousse is in season." },
        { from: "asmi", text: 'Great. Can you pipe "Love you Danny" with a purple heart at the end?' },
        { from: "them", text: "Yes, hand-piped in purple. $68, ready at 2 PM." },
        { from: "asmi", text: "Perfect, I'll text the details to confirm." },
      ],
    },
  },
  {
    id: "dentist",
    kind: "Service",
    title: "Schedule Glen Park Dental appointment",
    brief:
      "Send details (last name Kesley, phone +1 415 585 1500, found online) to Glen Park Dental to confirm a dentist appointment for Rish's toothache on Tuesday or Wednesday around 5:00 PM.",
    asmiAction: "Reached Glen Park Dental by call, then confirmed over message.",
    status: "in-motion",
    liveLine: "Appointment confirmed",
    ago: "8m ago",
    options: [
      {
        id: "glen-park-dental",
        name: "Glen Park Dental",
        address: "2865 Diamond St, Glen Park",
        hours: "Open · Closes 5 PM",
        rating: 4.8,
        reviews: 412,
        photos: [dental],
        tags: ["Insurance", "Emergency"],
        distance: "2.4 mi",
      },
    ],
    steps: [
      { label: "Call", state: "done", detail: "2m 14s", icon: "call" },
      { label: "Retry", state: "skipped", detail: "Not needed", icon: "retry" },
      { label: "Message", state: "done", detail: "Confirmed", icon: "message" },
      { label: "Email", state: "skipped", detail: "Not needed", icon: "email" },
    ],
    timeline: [
      { time: "3:11 PM", event: "Call placed to +1 415 585 1500", state: "done" },
      { time: "3:13 PM", event: "Spoke with the front desk — 2m 14s call", state: "done" },
      { time: "3:14 PM", event: "Retry skipped — call connected first time", state: "skipped" },
      { time: "3:20 PM", event: "Message sent with Rish's details", state: "done" },
      { time: "3:24 PM", event: "Front desk replied confirming Wednesday 5:00 PM", state: "done" },
      { time: "3:25 PM", event: "Task complete — email follow-up not needed", state: "done" },
    ],
    thread: [
      {
        from: "asmi",
        text: "Hi! Following up on the call — booking for Rish Kesley, toothache, Wednesday 5:00 PM. Phone +1 415 585 1500.",
        time: "3:20 PM",
      },
      {
        from: "them",
        text: "Got it. Wednesday 5:00 PM with Dr. Lin is confirmed. Please arrive 10 minutes early.",
        time: "3:24 PM",
      },
      { from: "asmi", text: "Perfect, thank you! Rish will be there.", time: "3:25 PM" },
    ],
    outcome: {
      label: "Resolved",
      headline: "Glen Park Dental confirmed Wednesday at 5:00 PM with Dr. Lin.",
      detail:
        "Asmi called the front desk, shared Rish's details, and confirmed over message. Arrive 10 minutes early; insurance card required.",
      at: "Aug 17, 3:25 PM",
    },
    recording: {
      to: "+1 415 585 1500",
      at: "3:11 PM",
      duration: "2:14",
      transcript: [
        { from: "asmi", text: "Hi, I'm calling on behalf of Rish Kesley about a toothache appointment." },
        { from: "them", text: "Sure — we have Wednesday at 5:00 PM open with Dr. Lin." },
        { from: "asmi", text: "Wednesday 5:00 PM works. I'll text over the details now." },
      ],
    },
  },
];

export function getTask(id: string) {
  return tasks.find((t) => t.id === id);
}
