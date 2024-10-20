export interface ChatModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string | null;
}

export interface ChatFormValues {
    message: string;
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
    message: string;
    creator: 'user' | 'admin';
}

export interface ChatBoxProps {
    room: {
        _id: string
        isForUser: string;
        messages: [Message];
        newMessageAdminToUser: boolean;
        newMessageUserToAdmin: boolean;
    };
    user: {
        _id: string;
        username: string;
        role: 'user' | 'admin'
    };
}