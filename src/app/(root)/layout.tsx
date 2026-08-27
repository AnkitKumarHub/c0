import { onBoarduser } from "@/features/auth/actions";

export default async function RootGroupLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    await onBoarduser();
    return children; // this is the children prop that is passed to the layout component
}