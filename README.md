# Bloeisprong

Een rustig puzzelspel voor het hele gezin. Je steen springt als een schaakstuk (paard, loper, toren, koning, dame) en laat elke knop in de tuin één keer bloeien. Er is geen klok. 200 tuinen in 4 seizoenen, 4 wondertuinen en een nachttuin (samen 250 tuinen), elk met een eigen lied dat groeit, een herbarium met 42 bloemen en een eigen thuistuin.

## Wondertuinen en nachttuin

Elk seizoen heeft een wondertuin van 10 tuinen met een nieuwe spelregel. Die opent na 25 tuinen van dat seizoen. De 200 gewone tuinen blijven zoals ze waren.

- **Lente, stapstenen:** daarop mag je zo vaak landen als je wil. Ze hoeven niet te bloeien. Toren, loper en dame stoppen erop.
- **Zomer, vijvers:** altijd per twee, met dezelfde kleur waterlelie. Land je op de ene, dan kom je boven bij de andere.
- **Herfst, bladerhopen:** de eerste keer waaien de bladeren weg, de tweede keer bloeit de knop.
- **Winter, ijs:** je glijdt door in de richting van je sprong tot je van het ijs af bent. Het paard glijdt in de richting van zijn lange stap.

De **nachttuin** (10 tuinen) opent na tuin 200 en mengt alle wonderen. Na nachttuin 5 krijg je de Maanbloem, na nachttuin 10 de Sterrenbloem.

Het spel werkt als app op iPhone, iPad en Android (een PWA) en ook offline.

## Grapjes, weetjes en wijsheden

Tik in de thuistuin op je wezentje, of kijk op de winstkaart na een tuin: het wezentje vertelt dan iets.

- **Altijd (ook offline):** Nederlandse tuin- en natuurweetjes, korte wijsheden en raadsels met antwoord. Die staan in `index.html` in de lijst `TALK`. Voeg er gerust zelf bij.
- **Alleen online:** af en toe een Engelse grap van [JokeAPI](https://jokeapi.dev). Het spel filtert nsfw, explicit, racistische en seksistische grappen eruit (`blacklistFlags=nsfw,explicit,racist,sexist`) en toont zelf ook nooit een grap die zo gemarkeerd is. Grappen in twee delen tonen de clou pas na een tik. Is de dienst traag (meer dan 3 seconden), onbereikbaar of ben je offline, dan gebruikt het spel stil de eigen lijst.
- **Privacy:** voor zo'n grap vraagt je toestel iets aan JokeAPI, waardoor die dienst je IP-adres ziet. Er gaan geen namen of spelgegevens mee. De grappen worden niet bewaard (de service worker slaat ze over). Wil je dat niet, zet dan in `index.html` de regel `fetchJoke();` bij "start" uit, of laat de functie leeg.
- De Engelse grappen kunnen iets grover zijn dan een kindermopje. Ze zijn niet x-rated, maar zijn ook niet gekeurd voor kinderen.

## Spelers

- Alles wordt alleen op het toestel bewaard. Er is geen server en geen account.
- Bij het openen kies je je speler of maak je een nieuwe: kies een wezentje en geef het een naam.
- Elke speler heeft een eigen voortgang, zaadjes, herbarium, thuistuin en instellingen (geluid, thema).
- Een speler kan een pincode van 4 cijfers krijgen. Die werkt als **slotje**, niet als echte beveiliging: ze voorkomt dat iemand per ongeluk op de verkeerde speler speelt of hem wist. Pincode vergeten? Tik op "Pincode vergeten?" en beantwoord de rekenvraag voor een grote mens. Dan verdwijnt de pincode.
- Wisselen: tik rechtsboven op je wezentje. Aanpassen of wissen: "Beheren".

De gegevens staan in de browseropslag onder `bloeisprong.spelers` (de lijst) en `bloeisprong.speler.<id>` (één per speler).

**Let op:** de voortgang hoort bij het toestel en bij de plek waar je speelt. Op iPhone en iPad heeft de app op het beginscherm een eigen opslag, los van Safari. Wis je de app van het beginscherm, dan verdwijnt ook de voortgang van alle spelers op dat toestel.

## Bestanden

```
index.html              het volledige spel (HTML, CSS en JavaScript, zonder libraries)
manifest.webmanifest    naam, kleuren en iconen van de app
sw.js                   service worker: maakt het spel offline speelbaar
icons/                  app-iconen (ook apple-touch-icon voor iPhone en iPad)
README.md               deze uitleg
.gitignore              bestanden die niet in GitHub horen
```

## Op GitHub Pages zetten

1. Maak op GitHub een nieuwe **openbare** repository, bijvoorbeeld `bloeisprong`.
2. Kies **Add file → Upload files** en sleep alle bestanden en de map `icons` erin. Klik **Commit changes**.
3. Ga naar **Settings → Pages**. Kies bij **Build and deployment → Source** voor **Deploy from a branch**, dan branch `main` en map `/ (root)`. Klik **Save**.
4. Na een minuutje staat het spel op `https://<jouw-gebruikersnaam>.github.io/bloeisprong/`.

## Een nieuwe versie uitbrengen

1. Vervang de gewijzigde bestanden op GitHub.
2. Verhoog in `sw.js` het nummer in `const VERSIE = 'bloeisprong-v1';` (bv. naar `v2`).
3. De toestellen halen de nieuwe versie op wanneer ze online zijn en het spel openen. Soms moet je de app een keer sluiten en opnieuw openen.

De voortgang van de spelers blijft bij een update gewoon bewaard.

## Als app installeren

- **iPhone en iPad:** open de link in Safari, tik op de **Deel**-knop en kies **Zet op beginscherm**.
- **Android:** open de link in Chrome, tik op het menu (⋮) en kies **App installeren** of **Toevoegen aan startscherm**.

Open het spel daarna altijd via het icoon op het beginscherm, zodat je steeds dezelfde spelers ziet.
