import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { getStudentById, type StudentRow } from "@/lib/db";

export const SESSION_COOKIE = "bh_session";
const SESSION_DAYS = 7;

function getSecretKey() {
  const secret =
    process.env.SESSION_SECRET ||
    "brain-hub-local-dev-secret-change-me-32chars";
  return new TextEncoder().encode(secret);
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function validatePassword(password: string): string | null {
  if (password.length < 8) {
    return "Құпия сөз кемінде 8 таңбадан тұруы керек.";
  }
  if (!/[A-Za-zА-Яа-яӘәІіҢңҒғҮүҰұҚқӨөҺһ]/.test(password) || !/\d/.test(password)) {
    return "Құпия сөзде әріп пен сан болуы керек.";
  }
  return null;
}

export function validateEmail(email: string): string | null {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Почта форматы дұрыс емес.";
  }
  return null;
}

export async function createSessionToken(student: StudentRow) {
  return new SignJWT({
    sub: String(student.id),
    sid: student.student_id,
    email: student.email,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(getSecretKey());
}

export async function setSessionCookie(token: string) {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function readSessionStudent(): Promise<StudentRow | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    const id = Number(payload.sub);
    if (!Number.isFinite(id)) return null;
    return getStudentById(id) ?? null;
  } catch {
    return null;
  }
}
