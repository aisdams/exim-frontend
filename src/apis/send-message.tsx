import { Res } from '@/types';
import { Novu } from '@novu/node';

const novuApiKey = process.env.NEXT_PUBLIC_NOVU_API_KEY;

if (!novuApiKey) {
  throw new Error('NEXT_PUBLIC_NOVU_API_KEY is not defined');
}

const novu = new Novu(novuApiKey, {
  backendUrl: process.env.NEXT_PUBLIC_API_URL,
});
export const notificationTemplateName = 'on-boarding-notification';

export default async function handler(req: any, res: any) {
  const { uuid } = JSON.parse(req.body);

  await novu.trigger(notificationTemplateName, {
    to: {
      subscriberId: uuid,
    },
    payload: {
      __source: 'notification-center-demo-app',
    },
  });

  return res.json({ finish: true });
}
