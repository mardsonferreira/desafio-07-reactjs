import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { useForm, Validate } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

type FormAddImageData = {
  url: string;
  title: string;
  description: string;
};

interface FormAddImageProps {
  closeModal: () => void;
}

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  const lessThan10MB = (fileList: FileList): boolean | string =>
    (fileList[0] && fileList[0].size / (1024 * 1024) < 10) ||
    'O arquivo deve ser menor que 10MB';

  const acceptedFormats = (fileList: FileList): boolean | string =>
    /\.(gif|jpeg|png)$/i.test(fileList[0].type.replace('/', '.')) ||
    'Somente são aceitos arquivos PNG, JPEG e GIF';

  const formValidations: Record<string, Partial<Validate<unknown>>> = {
    image: {
      required: 'Arquivo obrigatório',
      validate: {
        lessThan10MB,
        acceptedFormats,
      },
    },
    title: {
      required: 'Título obrigatório',
      maxLength: {
        value: 20,
        message: 'Máximo de 20 caracteres',
      },
      minLength: {
        value: 2,
        message: 'Mínimo de 2 caracteres',
      },
    },
    description: {
      required: 'Descrição obrigatória',
      maxLength: {
        value: 65,
        message: 'Máximo de 65 caracteres',
      },
    },
  };

  const queryClient = useQueryClient();

  const mutation = useMutation(
    async (data: FormAddImageData) => {
      await api.post('api/images', {
        ...data,
        url: imageUrl,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('images');
      },
    }
  );

  const { register, handleSubmit, reset, formState, setError, trigger } =
    useForm();
  const { errors } = formState;

  const onSubmit = async (formData: FormAddImageData): Promise<void> => {
    try {
      if (!imageUrl) {
        toast({
          status: 'error',
          title: 'Imagem não adicionada',
          description:
            'É preciso adicionar e aguardar o upload de uma imagem antes de realizar o cadastro.',
        });
      } else {
        await mutation.mutateAsync(formData);
        toast({
          status: 'success',
          title: 'Imagem cadastrada',
          description: 'Sua imagem foi cadastrada com sucesso.',
        });
      }
    } catch {
      toast({
        status: 'error',
        title: 'Falha no cadastro',
        description: 'Ocorreu um erro ao tentar cadastrar a sua imagem.',
      });
    } finally {
      reset();
      setImageUrl('');
      setLocalImageUrl('');
      closeModal();
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          name="image"
          {...register('image', formValidations.image)}
          error={errors.image}
        />

        <TextInput
          placeholder="Título da imagem..."
          name="title"
          {...register('title', formValidations.title)}
          error={errors.title}
        />

        <TextInput
          placeholder="Descrição da imagem..."
          name="description"
          {...register('description', formValidations.description)}
          error={errors.description}
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
