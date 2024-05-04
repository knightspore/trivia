import { PropsWithChildren } from "react";

type Props = {
    onClick?: () => void
    type?: "button" | "submit" | "reset"
}

export default function Button({ children, onClick, type }: PropsWithChildren<Props>) {
    return <button
        className="border border-pink-700 px-2 py-1 rounded text-sm"
        onClick={onClick}
        type={type}
    >
        {children}
    </button>
}
