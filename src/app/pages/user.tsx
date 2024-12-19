import {Button, TextField} from '@mui/material';
import {observer} from 'mobx-react-lite';
import {FormEvent, useEffect, useState} from 'react';
import {Severity} from '../model/message';
import {useRootStore} from '../state/root-store';
import {OnlyAnonymous, OnlyUser} from '../components/only-user';

export const User = observer(() => {
    const store = useRootStore();

    const [email, setEmail] = useState('');
    const [pwd, setPassword] = useState('');

    const [displayName, setDisplayName] = useState('');

    const [oldPwd, setOldPwd] = useState('');
    const [newPwd, setNewPwd] = useState('');

    useEffect(() => {
        setDisplayName(store.authStore.displayName || '');
    }, [store.authStore.displayName]);

    const connectUser = (event: FormEvent) => {
        event.preventDefault();

        const submitter = (event.nativeEvent as SubmitEvent)?.submitter as HTMLButtonElement;
        if (submitter?.value === 'create') {
            store.authService.connectUser({email, pwd});
        } else {
            store.authService.login({email, pwd});
        }
    };

    const resetPwd = (event: FormEvent) => {
        event.preventDefault();
        const email = store.authStore.currentUser?.email;
        if (email) {
            store.authService
                .resetPwdMail(email)
                .then(() => {
                    store.uiStore.setMessage({
                        text: 'Email wurde verschickt',
                        severity: Severity.success
                    });
                })
                .catch(() => {
                    store.uiStore.setMessage({
                        text: 'Email konnte nicht verschickt werden',
                        severity: Severity.error
                    });
                });
        }
    };

    const changeDisplayname = (event: FormEvent) => {
        event.preventDefault();
        store.authService.changeUser({displayName}).then(() => {
            store.uiStore.setMessage({text: 'Anzeigename wurde geändert', severity: Severity.success});
        })
            .catch((error: Error) => {
                store.uiStore.setMessage({text: error.message, severity: Severity.error});
            });
    };

    const changePwd = (event: FormEvent) => {
        event.preventDefault();
        store.authService
            .changeUser({
                pwd: newPwd,
                pwdOld: oldPwd,
                email: store.authStore.currentUser!.email!
            })
            .then(() => {
                store.uiStore.setMessage({
                    text: 'Password wurde geändert',
                    severity: Severity.success
                });
            })
            .catch((error: Error) => {
                store.uiStore.setMessage({
                    text: error.message,
                    severity: Severity.error
                });
            });
    };

    return (
        <>
            <div className="p-5">
                <div>
                    <OnlyAnonymous>
                        <div>
                            <div>Dieser Account ist nicht mit einer E-Mail verbunden</div>
                            <div>Listen können verloren gehen! Sie können ihren Account mit einem neuem Account
                                verbinden oder sich mit einem bestehemden Account anmelden.
                            </div>

                            <form onSubmit={connectUser}>
                                <div className="py-2">
                                <TextField variant="outlined" type="email" label="E-Mail"
                                           value={email} onChange={(e) => setEmail(e.target.value)} name="email"
                                           required/>
                                <TextField variant="outlined" type="password" label="Passwort"
                                           value={pwd} onChange={(e) => setPassword(e.target.value)} name="password"
                                           required/>
                                </div>
                                <div>
                                    <Button type="submit" value="create">
                                        Account Erstellen
                                    </Button>
                                    <Button type="submit" value="register">
                                        Anmelden
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </OnlyAnonymous>
                    <OnlyUser>

                        <div className="grid gap-5 items-center w-full" style={{gridTemplateColumns: 'auto 1fr'}}>
                            E-Mail
                            <TextField variant="outlined" type="email" label="E-mail"
                                       value={store.authStore.currentUser?.email} disabled/>

                            Anzeigename
                            <form onSubmit={changeDisplayname} id="displayNameForm">
                                <TextField variant="outlined" type="text" label="Anzeigename"
                                           className="w-full"
                                           value={displayName} onChange={(e) => setDisplayName(e.target.value)}
                                           required/>

                            </form>
                            <Button className="col-span-full" type="submit" form="displayNameForm">Anzeigename übernehmen</Button>

                            Passwort
                            <form onSubmit={changePwd} id="resetPwdForm" className="flex flex-col">
                                <TextField
                                    variant="outlined" type="password" label="Passwort Alt"
                                    value={oldPwd} onChange={(e) => setOldPwd(e.target.value)} required
                                />
                                <TextField variant="outlined" type="password" label="Passwort Neu"
                                           value={newPwd}
                                           onChange={(e) => setNewPwd(e.target.value)} required/>
                            </form>


                            <Button  className="col-span-full" type="submit" form="resetPwdForm">Passwort wechseln</Button>

                            <Button  className="col-span-full" type="button" onClick={resetPwd}>Passwort zurücksetzen</Button>
                        </div>
                    </OnlyUser>
                </div>
            </div>
        </>
    );
});
