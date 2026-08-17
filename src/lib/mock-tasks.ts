import mangoHeart from "@/assets/mango-heart-1.jpg";
import mangoTop from "@/assets/mango-heart-2.jpg";
import mangoSlice from "@/assets/mango-slice.jpg";
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
    asmiAction: 'Call each bakery to confirm heart mould, mango mousse and the "Love you Danny 💜" message.',
    status: "needs-you",
    liveLine: "4 options ready",
    ago: "4m ago",
    options: [
      {
        id: "b-patisserie",
        name: "b. Patisserie",
        address: "2821 California St, Lower Pac Heights",
        hours: "Open · Closes 6 PM",
        rating: 4.6,
        reviews: 3120,
        photos: [mangoHeart, mangoTop, cakePiping, mangoSlice],
        tags: ["Custom message", "Heart mould", "48h notice"],
        distance: "1.4 mi",
        confirmed: "Mango mousse · Saturday 2 PM",
        price: "$68 · 6 in",
        lead: "48h notice",
        reason:
          "Only shop that confirmed a heart mould, fresh Alphonso mango mousse and hand-piped script with the purple heart.",
      },
      {
        id: "schuberts",
        name: "Schubert's Bakery",
        address: "521 Clement St, Inner Richmond",
        hours: "Open · Closes 6:30 PM",
        rating: 4.5,
        reviews: 1860,
        photos: [cakeDisplay, bakeryInterior, mangoTop],
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
        photos: [bakeryInterior, cakeDisplay, mangoSlice],
        tags: ["Heart mould", "Pickup only"],
        distance: "2.2 mi",
        price: "$62 · 6 in",
        lead: "72h notice",
      },
      {
        id: "susiecakes",
        name: "SusieCakes",
        address: "565 Hayes St, Hayes Valley",
        hours: "Open · Closes 7 PM",
        rating: 4.3,
        reviews: 980,
        photos: [cakeDisplay, mangoHeart],
        tags: ["Custom message", "Walk-in"],
        distance: "1.1 mi",
        confirmed: "Message piping today",
        price: "$49 · 6 in",
        lead: "24h notice",
      },
    ],
    steps: [
      { label: "Search", state: "done", detail: "12 found", icon: "retry" },
      { label: "Call", state: "done", detail: "4 confirmed", icon: "call" },
      { label: "Confirm", state: "active", detail: "Your pick", icon: "message" },
    ],
    timeline: [
      { time: "3:02 PM", event: "Searched patisseries in SF that do custom mousse cakes", state: "done" },
      { time: "3:09 PM", event: "Called 12 bakeries about a heart mango mousse cake", state: "done" },
      { time: "3:21 PM", event: '4 confirmed the "Love you Danny 💜" piping', state: "done" },
      { time: "3:22 PM", event: "Waiting for you to pick one to order", state: "active" },
    ],
    thread: [],
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
