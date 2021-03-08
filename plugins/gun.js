import Gun from 'gun';
import SEA from 'gun/sea';

export default ({ app }, inject) => {
  const gun = Gun(
    'http://localhost:8765/gun',
    // Example of peers for production
    // ['https://hedronarchive.com/gun', 'http://localhost:8765/gun'],
    {
      // S3 or other adapter will be used in production
      // s3: {
      //   key: '',
      //   secret: '',
      //   bucket: '',
      // },
      // File storage used for development
      file: './gun/store.json',
    }
  );

  inject('gun', gun);
  inject('user', gun.user().recall({ sessionStorage: true }));
};
