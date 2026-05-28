Frage 1: Wie kommt der aktuelle User in den Store?
Frage 2: Wie werden die Listen vom User geladen?
Frage 3: Wie wird der Store aktualisiert wenn eine neue Liste dazukommt?




















Frage 1: Wie kommt der aktuelle User in den Store?
-> Firebase Lib kennt den aktuellen User und kann asynchron abgefragt werden.
-> Szenario: Synchronisation einer asynchronen Datenquelle in den Store
Frage 2: Wie werden die Listen vom User geladen?
-> Szenario: Trigger (ändern vom aktuellen User) startet die Synchronisation der Daten
Frage 3: Wie wird der Store aktualisiert wenn eine neue Liste dazukommt
-> Szenario: Trigger (Firebase Live Query) führt zu einer Synchronisation