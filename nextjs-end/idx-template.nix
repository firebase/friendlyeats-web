{ pkgs, packageManager ? "npm", ... }: {
  packages = [
    pkgs.nodejs_20
    pkgs.j2cli
    pkgs.nixfmt
  ];
  bootstrap = ''
    npx -y giget gh:firebase/friendlyeats-web/nextjs-end#jamesdaniels_fixServiceWorkers "$WS_NAME"
    mv "$WS_NAME" "$out"
  '';
}