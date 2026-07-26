"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Pencil, User as UserIcon, Search, Loader2, Mail, Phone } from "lucide-react";

import { useUsers } from "@/hooks/use-users";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export function UserList() {
  const { data: users = [], isLoading } = useUsers();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = useMemo(() => {
    const search = searchTerm.toLowerCase();
    return users.filter(
      (user) =>
        (user.name ?? user.fullName ?? "").toLowerCase().includes(search) ||
        user.email?.toLowerCase().includes(search) ||
        user.phoneNumber?.includes(search),
    );
  }, [users, searchTerm]);

  return (
    <div className="min-h-screen md:p-4">
      <DashboardHeader title="User Management" Icon={UserIcon} />

      <div className="mt-8 mb-8 flex flex-col gap-4 md:flex-row">
        <div className="group relative flex-1">
          <Search className="absolute top-1/2 left-5 h-5 w-5 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-[#1A0D08]" />
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            className="w-full rounded-2xl border-2 border-[#E0C9A6] bg-white py-3 pr-6 pl-14 font-bold outline-none transition-all placeholder:font-medium focus:border-[#1A0D08] focus:ring-4 focus:ring-[#6B4A3D]/10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-64 flex-col items-center justify-center text-[#1A0D08]">
          <Loader2 className="mb-4 h-12 w-12 animate-spin opacity-40" />
          <p className="text-sm font-black tracking-widest uppercase">Fetching users...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="rounded-[2.5rem] border-2 border-dashed border-[#E0C9A6] bg-white p-20 text-center">
          <UserIcon className="mx-auto mb-6 h-16 w-16 text-[#D4BFAA] opacity-50" />
          <h3 className="text-xl font-black text-[#1A0D08] uppercase italic">No users found</h3>
          <p className="mt-2 font-bold text-stone-400">Try a different search term.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border-2 border-[#E0C9A6] bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse text-left">
              <thead className="border-b-2 border-[#E0C9A6] bg-[#FDF8F3] text-[#1A0D08]">
                <tr>
                  <th className="px-4 py-2 text-[11px] font-black tracking-widest uppercase md:px-8 md:py-5">
                    User Details
                  </th>
                  <th className="px-4 py-2 text-[11px] font-black tracking-widest uppercase md:px-8 md:py-5">
                    Contact Info
                  </th>
                  <th className="px-4 py-2 text-[11px] font-black tracking-widest uppercase md:px-8 md:py-5">
                    Access Level
                  </th>
                  <th className="px-4 py-2 text-right text-[11px] font-black tracking-widest uppercase md:px-8 md:py-5">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5E6D3]">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="group transition-colors hover:bg-[#FDF8F3]/70">
                    <td className="px-4 py-2 md:px-8 md:py-5">
                      <p className="text-base leading-tight font-black text-[#1A0D08] uppercase italic">
                        {user.name ?? user.fullName}
                      </p>
                      <p className="mt-1 text-[10px] font-black tracking-tighter text-stone-400 uppercase">
                        UID: {user._id.slice(-8)}
                      </p>
                    </td>
                    <td className="px-4 py-2 md:px-8 md:py-5">
                      <div className="flex flex-col gap-1.5 font-bold text-[#6B4A3D]">
                        <div className="flex items-center gap-2 text-xs">
                          <div className="rounded-md bg-stone-100 p-1">
                            <Mail size={12} className="text-stone-500" />
                          </div>
                          {user.email}
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <div className="rounded-md bg-stone-100 p-1">
                            <Phone size={12} className="text-stone-500" />
                          </div>
                          {user.phoneNumber || "N/A"}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2 md:px-8 md:py-5">
                      <span
                        className={`rounded-full border-2 px-4 py-1.5 text-[10px] font-black tracking-[0.15em] uppercase ${
                          user.role === "admin"
                            ? "border-purple-100 bg-purple-50 text-purple-700"
                            : "border-blue-100 bg-blue-50 text-blue-700"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-right md:px-8 md:py-5">
                      <Link
                        href={`/dashboard/users/edit/${user._id}`}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 text-[#1A0D08] transition-all hover:bg-[#1A0D08] hover:text-white active:scale-90"
                      >
                        <Pencil size={18} strokeWidth={3} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
