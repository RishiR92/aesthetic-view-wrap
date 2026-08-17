import milkCake from "@/assets/place-milk-cake.jpg";
import baklava from "@/assets/place-baklava.jpg";
import chocolate from "@/assets/place-chocolate.jpg";
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
  timeline: { time: string; event: string }[];
  thread: { from: "asmi" | "them"; text: string; time: string }[];
};

export const tasks: Task[] = [
  {
    id: "sweet-treats",
    kind: "Service",
    title: "Find Sweet Treats Daly City",
    brief:
      "Find dessert spots with milk cake specifically located in downtown San Francisco for Rish.",
    asmiAction: "Call to confirm if milk cake is available at local dessert spots.",
    status: "needs-you",
    liveLine: "7 options ready",
    ago: "4m ago",
    options: [
      {
        id: "u-dessert",
        name: "U:Dessert Story",
        address: "3489 16th St",
        hours: "Open · Closes 10 PM",
        rating: 4.4,
        reviews: 1504,
        photos: [milkCake, chocolate, baklava],
        tags: ["Dine-in", "Delivery", "Popular"],
        distance: "1.2 mi",
        confirmed: "Milk cake today",
        reason:
          "Widest selection of Asian-inspired desserts and milk toast, with late evening hours.",
      },
      {
        id: "baklavastory",
        name: "Baklavastory.",
        address: "1830 Harrison St Ste B",
        hours: "Open · Closes 6 PM",
        rating: 4.9,
        reviews: 801,
        photos: [baklava],
        tags: ["Takeout"],
        distance: "0.6 mi",
        confirmed: "Milk cake today",
      },
      {
        id: "dandelion",
        name: "Dandelion Chocolate",
        address: "740 Valencia St",
        hours: "Open · Closes 9 PM",
        rating: 4.7,
        reviews: 2748,
        photos: [chocolate],
        tags: ["Dine-in", "Popular"],
        distance: "1.8 mi",
      },
      {
        id: "craftsman",
        name: "Craftsman & Wolves",
        address: "746 Valencia St",
        hours: "Open · Closes 6 PM",
        rating: 4.5,
        reviews: 1912,
        photos: [milkCake],
        tags: ["Bakery"],
        distance: "1.9 mi",
        confirmed: "Milk cake today",
      },
    ],
    steps: [
      { label: "Search", state: "done", detail: "7 found", icon: "retry" },
      { label: "Call", state: "active", detail: "In progress", icon: "call" },
      { label: "Confirm", state: "next", detail: "Next", icon: "message" },
    ],
    timeline: [
      { time: "3:02 PM", event: "Searched dessert spots near downtown SF" },
      { time: "3:07 PM", event: "Shortlisted 7 options with milk cake" },
      { time: "3:11 PM", event: "Waiting for you to pick one to call" },
    ],
    thread: [],
  },
  {
    id: "dentist",
    kind: "Service",
    title: "Book Dentist Appointment",
    brief:
      "Call Glen Park Dental at (415) 585-1500 to schedule a dentist appointment for Rish for a toothache, targeting Tuesday or Wednesday around 5:00 PM.",
    asmiAction: "Reaching Glen Park Dental across call, message and email.",
    status: "in-motion",
    liveLine: "Waiting on a reply",
    ago: "8m ago",
    options: [
      {
        id: "glen-park-dental",
        name: "Glen Park Dental",
        address: "2865 Diamond St",
        hours: "Open · Closes 5 PM",
        rating: 4.8,
        reviews: 412,
        photos: [dental],
        tags: ["Insurance", "Emergency"],
        distance: "2.4 mi",
      },
    ],
    steps: [
      { label: "Call", state: "done", detail: "Missed", icon: "call" },
      { label: "Retry", state: "skipped", detail: "Skipped", icon: "retry" },
      { label: "Message", state: "active", detail: "Sent", icon: "message" },
      { label: "Email", state: "next", detail: "Next", icon: "email" },
    ],
    timeline: [
      { time: "3:11 PM", event: "Call placed to +1 415 585 1500" },
      { time: "3:19 PM", event: "Call missed — +1 415 585 1500" },
      { time: "3:20 PM", event: "Message sent to +1 415 585 1500" },
    ],
    thread: [
      {
        from: "asmi",
        text: "Hi! Calling on behalf of Rish — any opening Tue or Wed around 5 PM for a toothache?",
        time: "3:20 PM",
      },
    ],
  },
];

export function getTask(id: string) {
  return tasks.find((t) => t.id === id);
}