"use client"
import { createContext, useContext, useState } from "react"
import Modal from "../components/modal"

const ModalContext = createContext(null)

export function ModalProvider({ children }) {
  const [content, setContent] = useState(null)

  const openModal = (c) => setContent(c)
  const closeModal = () => setContent(null)

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <Modal isOpen={!!content} onClose={closeModal}>
        {content}
      </Modal>
    </ModalContext.Provider>
  )
}

export const useModal = () => useContext(ModalContext)
