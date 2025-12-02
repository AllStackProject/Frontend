let modalHandler: ((props: any) => void) | null = null;

export const registerModalHandler = (handler: (props: any) => void) => {
  modalHandler = handler;
};

export const openModalGlobally = (props: any) => {
  if (modalHandler) {
    modalHandler(props);
  } else {
    console.warn("Modal handler not registered yet");
  }
};