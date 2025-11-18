"use client";

import { createContext, ReactNode, useContext, useState } from "react";

interface PopupContextProps {
    openPopup: (content: ReactNode, color: string) => void;
    closePopup: () => void;
    popupContent: ReactNode | null;
    popupColor: string;
}

const PopupContext = createContext<PopupContextProps>({} as PopupContextProps);

export const PopupProvider = ({ children }: {children: ReactNode}) => {
    const [popupContent, setPopupContent] = useState<ReactNode | null>(null);
    const [popupColor, setPopupColor] = useState<string>("primary");

    const openPopup = (content: ReactNode, color: string) => {
        setPopupContent(content);
        setPopupColor(color);
    }

    const closePopup = () => {
        setPopupContent(null);
    }

    return (
        <PopupContext.Provider value={{ openPopup, closePopup, popupContent, popupColor }}>
            {children}
        </PopupContext.Provider>
    )
}

export const usePopup = () => useContext(PopupContext);