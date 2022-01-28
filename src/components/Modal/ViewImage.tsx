import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Image,
  Link,
} from '@chakra-ui/react';

interface ModalViewImageProps {
  isOpen: boolean;
  onClose: () => void;
  imgUrl: string;
}

export function ModalViewImage({
  isOpen,
  onClose,
  imgUrl,
}: ModalViewImageProps): JSX.Element {
  return (
    <Modal onClose={onClose} isOpen={isOpen} size="4xl">
      <ModalOverlay />
      <ModalContent
        alignItems="self-start"
        width="auto"
        height="auto"
        bgColor="pGray.800"
      >
        <ModalBody padding="0">
          <Image src={imgUrl} maxWidth="900px" maxHeight="600px" />
        </ModalBody>
        <ModalFooter color="white">
          <Link href={imgUrl} target="_blank">
            Abrir original
          </Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
