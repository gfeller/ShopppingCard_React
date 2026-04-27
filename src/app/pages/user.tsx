import { OnlyAnonymous, OnlyUser } from '../components/only-user';
import { UserAnonymous } from '../components/user-anonymous';
import { UserConnected } from '../components/user-connected';

export const User = () => {
  return (
    <div className="p-5"> 
      <OnlyAnonymous>
        <UserAnonymous />
      </OnlyAnonymous>
      <OnlyUser>
        <UserConnected />
      </OnlyUser>
    </div>
  );
};
