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
  website?: { label: string; href: string };
  phone?: string;
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
  plan: string;
  status: "needs-you" | "in-motion";
  liveLine: string;
  ago: string;
  options: Place[];
  steps: ChannelStep[];
  timeline: { time: string; event: string; state?: "done" | "skipped" | "active" }[];
  thread: { from: "asmi" | "them"; text: string; time: string }[];
  outcome?: { label: string; headline: string; detail: string; at: string };
  confirmedDetails?: { label: string; value: string }[];
  recording?: {
    to: string;
    at: string;
    duration: string;
    transcript: { from: "asmi" | "them"; text: string }[];
  };
  email?: {
    to: string;
    subject: string;
    at: string;
    body: string[];
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
    plan:
      'Asmi will call b. Patisserie to lock the heart mould, mango mousse and "Love you Danny 💜" piping for Saturday pickup.',
    status: "needs-you",
    liveLine: "3 patisseries found",
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
        website: { label: "bpatisserie.com", href: "https://bpatisserie.com" },
        phone: "+1 415 440 1700",
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
        website: { label: "schubertsbakery.com", href: "https://www.schubertsbakery.com" },
        phone: "+1 415 752 1580",
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
        website: { label: "noevalleybakery.com", href: "https://www.noevalleybakery.com" },
        phone: "+1 415 550 1405",
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
    id: "gardener",
    kind: "Service",
    title: "Book Quality Green Gardening",
    brief:
      "Call Quality Green Gardening and Landscaping (+1 669 228 3221) on behalf of Rish at 73 Nora St, Atherton, CA to request a quote and check availability for garden cleanup—clearing dry pine needles, leaves, and debris from the brick pathways.",
    asmiAction: "Booked over call and sent the final details by email.",
    plan: "Asmi will confirm the cleanup scope, crew, price, and arrival time directly with the gardener.",
    status: "in-motion",
    liveLine: "Gardener booked",
    ago: "Just now",
    options: [
      {
        id: "quality-green-gardening",
        name: "Quality Green Gardening & Landscaping",
        address: "Serving Atherton, CA",
        hours: "Booked · Friday 3 PM",
        rating: 4.9,
        reviews: 86,
        photos: [dental],
        tags: ["Garden cleanup", "2-person crew"],
        distance: "Atherton",
        phone: "+1 669 228 3221",
      },
    ],
    steps: [
      { label: "Call", state: "done", detail: "4m 18s", icon: "call" },
      { label: "Retry", state: "skipped", detail: "Not needed", icon: "retry" },
      { label: "Message", state: "skipped", detail: "Not needed", icon: "message" },
      { label: "Email", state: "done", detail: "Details sent", icon: "email" },
    ],
    timeline: [
      { time: "6:35 PM", event: "Called Quality Green Gardening at +1 669 228 3221", state: "done" },
      { time: "6:39 PM", event: "Friday at 3:00 PM confirmed for $450 with a two-person crew", state: "done" },
      { time: "6:40 PM", event: "Final cleanup and arrival details emailed to the gardener", state: "done" },
      { time: "6:40 PM", event: "Booking complete", state: "done" },
    ],
    thread: [],
    outcome: {
      label: "Resolved",
      headline: "Quality Green Gardening is booked for Friday at 3:00 PM.",
      detail:
        "A two-person crew will clear the dry pine needles, leaves, and debris from the brick pathways at 73 Nora St for $450. Pay after the work is complete.",
      at: "Today, 6:40 PM",
    },
    confirmedDetails: [
      { label: "When", value: "Friday · 3:00 PM" },
      { label: "Where", value: "73 Nora St, Atherton, CA" },
      { label: "Crew", value: "Gardener + 1 helper" },
      { label: "Price", value: "$450 · pay after service" },
      { label: "Scope", value: "Dry pine needles, leaves, and debris cleared from brick pathways" },
    ],
    recording: {
      to: "+1 669 228 3221",
      at: "6:35 PM",
      duration: "4:18",
      transcript: [
        { from: "asmi", text: "Hi, I'm calling on behalf of Rish about a garden cleanup at 73 Nora Street in Atherton." },
        { from: "asmi", text: "The job is to clear dry pine needles, leaves, and debris from the brick pathways. Are you available Friday at 3 PM?" },
        { from: "them", text: "Yes. I'll bring one helper, so there will be two of us. The total will be $450." },
        { from: "asmi", text: "Perfect—Friday at 3 PM, two people, $450 total, and payment after the cleanup is finished. Is that all confirmed?" },
        { from: "them", text: "Confirmed. We'll bring our own tools and bags." },
        { from: "asmi", text: "Great. I'll email the address and full scope now so you have everything in writing." },
      ],
    },
    email: {
      to: "contact@gglandscaping.info",
      subject: "Confirmed: garden cleanup Friday at 3 PM",
      at: "6:40 PM",
      body: [
        "Hi Quality Green Gardening team,",
        "Confirming Friday at 3:00 PM at 73 Nora St, Atherton, CA.",
        "Scope: clear dry pine needles, leaves, and debris from the brick pathways. You’ll arrive with one helper, making a two-person crew. The agreed total is $450, payable after the work is complete.",
        "Please bring all tools and cleanup bags. Thank you.",
      ],
    },
  },
];

export function getTask(id: string) {
  return tasks.find((t) => t.id === id);
}
