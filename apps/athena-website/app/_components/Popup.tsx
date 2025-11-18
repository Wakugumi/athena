"use client";

import { Modal } from "flowbite-react";
import { usePopup } from "@/context/PopupContext";

export default function Popup() {
  const { popupContent, popupColor, closePopup } = usePopup();
  if (!popupContent) {
    return null;
  }

  return (
    <Modal show={true} onClose={closePopup}>
      <div className={`p-6 bg-${popupColor} text-${popupColor}-text`}>
        {popupContent}
      </div>
    </Modal>
  );
}
