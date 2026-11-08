
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { appPrisma } from "@/lib/app-prisma";
import { requireRole } from "@/lib/auth/user-session";
import { adminUserSchema } from "@/lib/skema";

export type AdminUserFormState = {
  status: "idle" | "error" | "success";
  message: string;
  errors: {
    username?: string;
    email?: string;
    role?: string;
  };
  values: {
    username: string;
    email: string;
    role: string;
  };
};

export async function updateUser(
  userId: string,
  _previousState: AdminUserFormState,
  formData: FormData,
): Promise<AdminUserFormState> {
  const session = await requireRole(["ADMIN"]);

  const input = {
    username: formData.get("username"),
    email: formData.get("email"),
    role: formData.get("role"),
  };

  const validation = adminUserSchema.safeParse(input);

  if (!validation.success) {
    const errors: AdminUserFormState["errors"] = {};

    for (const issue of validation.error.issues) {
      const field = issue.path[0];

      if (
        field === "username" ||
        field === "email" ||
        field === "role"
      ) {
        errors[field] = issue.message;
      }
    }

    return {
      status: "error",
      message: "Periksa kembali data pengguna.",
      errors,
      values: {
        username: String(input.username ?? ""),
        email: String(input.email ?? ""),
        role: String(input.role ?? ""),
      },
    };
  }

  const { username, email, role } = validation.data;
  const normalizedEmail = email.toLowerCase();

  if (userId === session.userId && role !== "ADMIN") {
    return {
      status: "error",
      message: "Admin tidak dapat menurunkan role akunnya sendiri.",
      errors: {
        role: "Role akun Admin yang sedang digunakan tidak dapat diturunkan.",
      },
      values: { username, email: normalizedEmail, role },
    };
  }

  try {
    const existingUser = await appPrisma.user.findFirst({
      where: {
        id: { not: userId },
        OR: [
          { username },
          { email: normalizedEmail },
        ],
      },
      select: { id: true },
    });

    if (existingUser) {
      return {
        status: "error",
        message: "Username atau email sudah digunakan pengguna lain.",
        errors: {},
        values: { username, email: normalizedEmail, role },
      };
    }

    await appPrisma.$transaction(async (tx) => {
      const targetUser = await tx.user.findUnique({
        where: { id: userId },
        select: { id: true, role: true },
      });

      if (!targetUser) {
        throw new Error("USER_NOT_FOUND");
      }

      if (targetUser.role === "ADMIN" && role === "USER") {
        const adminCount = await tx.user.count({
          where: { role: "ADMIN" },
        });

        if (adminCount <= 1) {
          throw new Error("LAST_ADMIN");
        }
      }

      await tx.user.update({
        where: { id: userId },
        data: {
          username,
          email: normalizedEmail,
          role,
        },
      });
    });

    revalidatePath("/admin");

    return {
      status: "success",
      message: "Data pengguna berhasil diperbarui.",
      errors: {},
      values: { username, email: normalizedEmail, role },
    };
  } catch (error) {
    if (error instanceof Error && error.message === "LAST_ADMIN") {
      return {
        status: "error",
        message: "Admin terakhir tidak dapat diubah menjadi USER.",
        errors: {
          role: "Minimal harus ada satu akun ADMIN.",
        },
        values: { username, email: normalizedEmail, role },
      };
    }

    if (error instanceof Error && error.message === "USER_NOT_FOUND") {
      return {
        status: "error",
        message: "Pengguna tidak ditemukan.",
        errors: {},
        values: { username, email: normalizedEmail, role },
      };
    }

    console.error("Gagal memperbarui pengguna:", error);

    return {
      status: "error",
      message: "Data pengguna gagal diperbarui.",
      errors: {},
      values: { username, email: normalizedEmail, role },
    };
  }
}

export async function deleteUser(userId: string): Promise<void> {
  const session = await requireRole(["ADMIN"]);

  if (userId === session.userId) {
    throw new Error("Admin tidak dapat menghapus akunnya sendiri.");
  }

  await appPrisma.$transaction(async (tx) => {
    const targetUser = await tx.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    });

    if (!targetUser) {
      throw new Error("Pengguna tidak ditemukan.");
    }

    if (targetUser.role === "ADMIN") {
      const adminCount = await tx.user.count({
        where: { role: "ADMIN" },
      });

      if (adminCount <= 1) {
        throw new Error("Admin terakhir tidak dapat dihapus.");
      }
    }

    await tx.user.delete({
      where: { id: userId },
    });
  });

  revalidatePath("/admin");
  redirect("/admin");
}
