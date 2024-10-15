export interface ChatModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string | null;
}

export interface ChatFormValues {
    message: string;
}

export interface Message {
    text: string;
    sender: 'user' | 'admin';
}

export interface ChatModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string | null;
}

export interface ChatFormValues {
    message: string;
}

export interface Message {
    text: string;
    sender: 'user' | 'admin';
}
