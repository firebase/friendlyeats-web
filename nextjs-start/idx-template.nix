{ pkgs, packageManager ? "npm", ... }: {
  packages = [
    pkgs.nodejs_20
    pkgs.j2cli
    pkgs.nixfmt
  ];
  bootstrap = ''
    npx -y giget gh:firebase/friendlyeats-web/nextjs-start#jamesdaniels_fixServiceWorkers "$WS_NAME"
    rm "$WS_NAME/idx-template.*"
    mv "$WS_NAME" "$out"
  '';
}