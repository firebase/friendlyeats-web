{ pkgs }: {
  channel = "stable-23.11";
  packages = [
    pkgs.nodejs_20
  ];
  env = {
    NEXT_TELEMETRY_DISABLED = "1";
  };
  idx.workspace = {
      onStart = {
        npm-install = "npm ci --no-audit --prefer-offline --no-progress --timing";
        default.openFiles = [".env"];
      };
      onCreate = {
        firebase-setup = "firebase use && firebase use \${curl -s -H \"Metadata-Flavor: Google\" http://metadata.google.internal/computeMetadata/v1/project/project-id} || true";
      };
  };
  idx.extensions = [
  ];
  idx.previews = {
      enable = true;
      previews = {
        web = {
          command = ["npm" "run" "dev" "--" "--port" "$PORT" "--hostname" "0.0.0.0"];
          manager = "web";
        };
      };
  };
}