import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Avatar } from '@mui/material';
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined';
import { v4 as uuidv4 } from 'uuid';

import { useTheme } from '@ui/theme';
import { useSnackbar } from '@ui/snackBar';
import Image from '@ui/image';
import { Grid } from '@ui/layout';
import { Button } from '@ui/button';

import { IForm } from '../../orgCreation/orgCreation';

interface UploadProfilePictureProps {
  setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
  orgLogo?: string | undefined;
}

export default function UploadOrgProfilePicture(props: UploadProfilePictureProps) {
  const { palette } = useTheme();
  const { openSnackbar } = useSnackbar();
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(props.orgLogo || null);
  const methods = useFormContext<IForm>();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const profileImageKey: string = uuidv4();

    if (!event.target.files) return;
    const file = event.target.files[0];
    if (!file) return;

    // Check if file size is more than 2MB (2 * 1024 * 1024 bytes)
    if (file.size > 2 * 1024 * 1024) {
      openSnackbar('File size exceeds 2MB. Please select a smaller file.', 'error');
      return;
    }

    const validFileTypes = ['image/jpeg', 'image/png'];
    if (!validFileTypes.includes(file.type)) {
      openSnackbar('Only .jpg and .png files are allowed.', 'warning');
      return;
    }

    methods.setValue('organizationProfilePicture', profileImageKey);
    props.setSelectedFile(file);
    setProfileImageUrl(URL.createObjectURL(file));
  };

  return (
    <Grid item display="flex" flexDirection="row" alignContent="flex-start" alignItems="flex-start" mt="32px" mb="32px">
      {profileImageUrl ? (
        <Image shape="rounded" isAvatar width={88} height={88} src={profileImageUrl} alt="organization image" />
      ) : (
        <Avatar variant="rounded" sx={{ width: '88px', height: '88px', bgcolor: palette.grey[100] }}>
          <HomeWorkOutlinedIcon fontSize="large" sx={{ color: palette.grey[200] }} />
        </Avatar>
      )}

      <input
        type="file"
        accept=".jpg, .jpeg, .png"
        onChange={handleImageUpload}
        style={{ display: 'none' }}
        id="upload-button"
      />
      <Button
        variant="outlined"
        sx={{ marginLeft: '24px', marginTop: '25px', width: '140px' }}
        onClick={() => document.getElementById('upload-button')?.click()}
      >
        Upload picture
      </Button>
    </Grid>
  );
}
