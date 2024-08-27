import React, { useState } from 'react';
import { userIdAtom } from '@applicationAtoms/app.atom';
import { Box, ImageList, SvgIcon, Typography, useTheme, CircularProgress } from '@mui/material';
import { userProfilePictureAtom } from '@serverAtoms/users/userProfilePicture.atom';
import { Button } from '@ui/button';
import GalleryIcon from '@ui/icons/GalleryIcon';
import Image from '@ui/image';
import CustomModal from '@ui/customModal';
import { useSnackbar } from '@ui/snackBar';
import { Storage } from 'aws-amplify';
import { useAtom } from 'jotai';

interface UploadPictureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UploadPictureModal: React.FC<UploadPictureModalProps> = ({ isOpen, onClose }) => {
  const theme = useTheme();
  const [userId] = useAtom<string>(userIdAtom);
  const [userProfilePicture] = useAtom(userProfilePictureAtom);
  const { openSnackbar } = useSnackbar();
  const [isUploading, setIsUploading] = useState(false);

  const sources = [
    '/images/profilePictures/elephant.png',
    '/images/profilePictures/ambulance.png',
    '/images/profilePictures/book.png',
    '/images/profilePictures/green.png',
    '/images/profilePictures/people.png',
  ];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];

      if (file.size > 2 * 1024 * 1024) {
        return openSnackbar('Please select an image less than 2MB', 'error');
      }

      await uploadProfilePicture(file);
    }
  };

  const handleSourceClick = async (source: string) => {
    const response = await fetch(source);
    const blob = await response.blob();
    const file = new File([blob], source.split('/').pop() || 'image.png', { type: blob.type });

    if (file.size > 2 * 1024 * 1024) {
      return openSnackbar('Please select an image less than 2MB', 'error');
    }

    await uploadProfilePicture(file);
  };

  const uploadProfilePicture = async (fileToUpload: File) => {
    try {
      setIsUploading(true);
      await Storage.put(userId, fileToUpload, {
        contentType: fileToUpload.type,
      });
      void userProfilePicture.refetch();
      openSnackbar('Profile picture uploaded successfully', 'success');
      onClose();
    } catch (error) {
      openSnackbar('Error', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <CustomModal open={isOpen} onClose={onClose} title="Upload picture">
      <>
        <Typography variant="body1" sx={{ fontSize: '14px', fontWeight: '400' }}>
          Select a cause as your profile picture
        </Typography>
        <Box>
          <ImageList cols={5}>
            {sources.map((source) => (
              <Box
                sx={{
                  borderRadius: '56px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  margin: '8px',
                  cursor: 'pointer',
                  border: '1px solid transparent',
                  transition: '.3s border-color',
                  ':hover': {
                    border: `0.5px solid ${theme.palette.primary.main}`,
                  },
                }}
              >
                <Image
                  sx={{ backgroundColor: theme.palette.primary.light }}
                  width="76px"
                  height="76px"
                  src={source}
                  alt={source}
                  onClick={() => handleSourceClick(source)}
                />
              </Box>
            ))}
          </ImageList>
        </Box>
        <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} id="fileInput" />
        <Button
          onClick={() => document.getElementById('fileInput')?.click()}
          sx={{
            background: '#F4F7FF',
            color: '#374EA9',
            boxShadow: 'none',
            ':hover': {
              background: 'none',
            },
          }}
          variant="outlined"
          color="primary"
          fullWidth
          disabled={isUploading}
        >
          {isUploading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            <>
              <SvgIcon sx={{ marginRight: '8px' }}>{GalleryIcon}</SvgIcon> Upload from gallery
            </>
          )}
        </Button>
      </>
    </CustomModal>
  );
};

export default UploadPictureModal;
