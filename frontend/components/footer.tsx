// import Link from "next/link";
// import {
//   Facebook,
//   Instagram,
//   Linkedin,
//   Twitter,
// } from "lucide-react";

// export default function Footer() {
//   return (
//     <footer className="border-t bg-slate-50">
//       <div className="mx-auto max-w-7xl px-4 py-16">
//         <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
//           {/* Brand */}
//           <div className="lg:col-span-2">
//             <div className="flex items-center gap-2">
//               <div className="h-9 w-9 rounded-xl bg-orange-500" />
//               <span className="text-xl font-bold text-slate-900">
//                 Super Mandi
//               </span>
//             </div>

//             <p className="mt-4 max-w-md text-slate-600">
//               India's Agricultural Operating System connecting
//               farmers, buyers and businesses through one trusted
//               digital platform.
//             </p>

//             <div className="mt-6 flex gap-4">
//               <Link
//                 href="#"
//                 className="rounded-lg border p-2 text-slate-600 transition hover:bg-white"
//               >
//                 <Linkedin className="h-5 w-5" />
//               </Link>

//               <Link
//                 href="#"
//                 className="rounded-lg border p-2 text-slate-600 transition hover:bg-white"
//               >
//                 <Twitter className="h-5 w-5" />
//               </Link>

//               <Link
//                 href="#"
//                 className="rounded-lg border p-2 text-slate-600 transition hover:bg-white"
//               >
//                 <Instagram className="h-5 w-5" />
//               </Link>

//               <Link
//                 href="#"
//                 className="rounded-lg border p-2 text-slate-600 transition hover:bg-white"
//               >
//                 <Facebook className="h-5 w-5" />
//               </Link>
//             </div>
//           </div>

//           {/* Product */}
//           <div>
//             <h3 className="font-semibold text-slate-900">
//               Product
//             </h3>

//             <ul className="mt-4 space-y-3 text-sm text-slate-600">
//               <li>
//                 <Link href="/marketplace">Marketplace</Link>
//               </li>
//               <li>
//                 <Link href="#">Procurement</Link>
//               </li>
//               <li>
//                 <Link href="#">Pricing</Link>
//               </li>
//             </ul>
//           </div>

//           {/* Company */}
//           <div>
//             <h3 className="font-semibold text-slate-900">
//               Company
//             </h3>

//             <ul className="mt-4 space-y-3 text-sm text-slate-600">
//               <li>
//                 <Link href="#">About Us</Link>
//               </li>
//               <li>
//                 <Link href="#">Contact</Link>
//               </li>
//               <li>
//                 <Link href="#">Careers</Link>
//               </li>
//             </ul>
//           </div>

//           {/* Legal */}
//           <div>
//             <h3 className="font-semibold text-slate-900">
//               Legal
//             </h3>

//             <ul className="mt-4 space-y-3 text-sm text-slate-600">
//               <li>
//                 <Link href="#">Privacy Policy</Link>
//               </li>
//               <li>
//                 <Link href="#">Terms of Service</Link>
//               </li>
//               <li>
//                 <Link href="#">Support</Link>
//               </li>
//             </ul>
//           </div>
//         </div>

//         {/* Bottom Bar */}
//         <div className="mt-12 border-t pt-6">
//           <div className="flex flex-col items-center justify-between gap-4 text-sm text-slate-500 md:flex-row">
//             <p>
//               © {new Date().getFullYear()} Super Mandi. All rights
//               reserved.
//             </p>

//             <p>
//               Built for Farmers, Buyers & Businesses across India 🇮🇳
//             </p>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }