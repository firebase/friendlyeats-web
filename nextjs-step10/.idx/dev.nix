{ pkgs }: {
  channel = "stable-23.11";
  packages = [
    pkgs.nodejs_20
    pkgs.yarn
    pkgs.nodePackages.pnpm
    pkgs.bun
  ];
  idx.workspace = {
      # Runs when a workspace is first created with this `dev.nix` file
      onStart = {
        npm-install = "npm ci --no-audit --prefer-offline --no-progress --timing";
      };
      # To run something each time the workspace is (re)started, use the `onStart` hook
  };

  idx.extensions = [

  ];
  idx.previews = {
      enable = false;
      previews = {
        web = {
          command = ["npm" "run" "dev" "--" "--port" "$PORT" "--hostname" "0.0.0.0"];
          manager = "web";
        };
      };
  };
}
