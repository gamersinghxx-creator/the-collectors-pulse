import { redirect } from 'next/navigation';

// The Hub is now the site's front door at "/". Keep /hub as a permanent alias.
export default function HubAlias() {
  redirect('/');
}
