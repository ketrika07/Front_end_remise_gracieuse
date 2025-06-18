# ModeleFrontLucy

## instructions
- **Il est vraiment recommandé de mettre votre code dans un dossier dedié (module separé), avec ses pages, models,components et services pour une raison de maintenabilité et de faciliter le deboggage** 
- Mettre en majuscule les variables d'environnements
- Cree votre module dans le dossier `/modules` avec ses propres routing, (voir exemple du module general)
- ajouter le route menant vers votre module dans `app-routing.module.ts`
- Ajouter `canActivate: [AppGuard]` dans `app-routing.module.ts`  pour votre module pour la gestion de token venant du portail de Lucy
- decommenter  le ligne `{provide: HTTP_INTERCEPTORS,useClass: ApiInterceptor,multi: true}` dans `app.module.ts` pour utiliser l'interceptor(envoi de token dans le back-end pour voir si c'est expiré,...)
- vous pouver trouver les models de formulaires,inputs,boutons,... et une modele de page vide dans `/modules/general/pages`
- vous pouver ajouter les menus du sidebar dans le tableau `ROUTES` dans `/modules/general/components/sidebar/sidebar.components.ts`
- Pour test en local, ne pas activer l'interceptor et l'app AppGuard
- Dans `src/assets/config.json` , vous pouvez configurer le `side-menu` (le menu à gauche) et la version de l'application. Par defaut, `hideMenuButton : true`, le side-menu ne s'ouvre pas et le boutton du side-menu n'est pas visible 

## installation

```
cree un repository vide de votre projet dans git
git clone git@192.168.7.71:manohisoa_r/modele-front-lucy.git
renommer le dossier modele-front-lucy à votre nom de projet (exemple: projet1)
cd projet1
npm install
git remote rename origin old-origin
git remote add origin git@192.168.7.71:votre_nom/projet1.git
git push -u origin --all
git push -u origin --tags
```
