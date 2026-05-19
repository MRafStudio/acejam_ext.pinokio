module.exports = {
    run: [
        {
            method: "script.start",
            params: {
                uri: "torch.js",
                params: {
                    venv: "env",
                    path: "app"
                }
            }
        },
        {
            method: "shell.run",
            params: {
                venv: "env",
                path: "app",
                message: [
                    "uv pip install -r requirements.txt"
                ]
            }
        },
        {
            when: "{{platform === 'darwin' && arch === 'arm64'}}",
            method: "shell.run",
            params: {
                venv: "env",
                path: "app",
                message: [
                    "CMAKE_ARGS=\"-DCMAKE_OSX_ARCHITECTURES=arm64 -DCMAKE_APPLE_SILICON_PROCESSOR=arm64 -DGGML_METAL=on\" uv pip install --upgrade --force-reinstall --no-cache-dir llama-cpp-python==0.3.20",
                    "python -c \"import llama_cpp; print(llama_cpp.__version__)\""
                ]
            }
        },
        {
            when: "{{platform === 'win32' && arch === 'x64'}}",
            method: "shell.run",
            params: {
                venv: "env",
                path: "app",
                message: [
                    "uv pip install --upgrade --force-reinstall \"https://github.com/abetlen/llama-cpp-python/releases/download/v0.3.19/llama_cpp_python-0.3.19-cp310-cp310-win_amd64.whl\"",
                    "python -c \"import llama_cpp; print(llama_cpp.__version__)\""
                ]
            }
        },
        {
            when: "{{platform === 'darwin' && arch !== 'arm64'}}",
            method: "shell.run",
            params: {
                venv: "env",
                path: "app",
                message: [
                    "CMAKE_ARGS=\"-DGGML_METAL=OFF\" uv pip install --upgrade --force-reinstall --no-cache-dir llama-cpp-python==0.3.20 numpy==1.26.4",
                    "python -c \"import llama_cpp; print(llama_cpp.__version__)\""
                ]
            }
        },
        {
            when: "{{platform !== 'darwin' && platform !== 'win32'}}",
            method: "shell.run",
            params: {
                venv: "env",
                path: "app",
                message: [
                    "uv pip install --index-strategy unsafe-best-match --extra-index-url https://abetlen.github.io/llama-cpp-python/whl/cpu --upgrade --force-reinstall --no-cache-dir llama-cpp-python==0.3.20",
                    "python -c \"import llama_cpp; print(llama_cpp.__version__)\""
                ]
            }
        },
        {
            method: "shell.run",
            params: {
                venv: "env",
                path: "app",
                message: [
                    "python -c \"import sys, platform, numpy, soundfile, torch, gradio, transformers, diffusers; intel_mac = sys.platform == 'darwin' and platform.machine() == 'x86_64'; assert (not intel_mac) or numpy.__version__.split('.')[0] == '1', f'Intel Mac requires NumPy 1.x, got {numpy.__version__}'; assert (not intel_mac) or diffusers.__version__ == '0.31.0', f'Intel Mac requires diffusers 0.31.0, got {diffusers.__version__}'; print('Core Python deps ready')\""
                ]
            }
        },
        {
            method: "shell.run",
            params: {
                venv: "env",
                path: "app",
                message: [
                    "python -c \"from huggingface_hub import snapshot_download; " +
                    "model_map = {'turbo': 'acestep-v15-turbo', 'xl_turbo': 'acestep-v15-xl-turbo', 'xl_base': 'acestep-v15-xl-base'}; " +
                    "selected = '{{ace_model}}'; " +
                    "model_name = model_map.get(selected, 'acestep-v15-xl-base'); " +
                    "print(f'Downloading ACE-Step model: {model_name}'); " +
                    "snapshot_download(f'ACE-Step/{model_name}', local_dir=f'model_cache/checkpoints/{model_name}')\""
                ]
            }
        },
        {
            method: "shell.run",
            params: {
                venv: "env",
                path: "app",
                message: [
                    "python -c \"from huggingface_hub import snapshot_download; " +
                    "composer_map = {'tiny': 'Qwen/Qwen3-0.6B-GGUF', 'balanced': 'Qwen/Qwen3-1.7B-GGUF', 'quality': 'Qwen/Qwen3-4B-GGUF'}; " +
                    "selected = '{{composer_model}}'; " +
                    "repo_name = composer_map.get(selected, 'Qwen/Qwen3-4B-GGUF'); " +
                    "local_name = repo_name.split('/')[-1]; " +
                    "print(f'Downloading Composer model: {repo_name}'); " +
                    "snapshot_download(repo_name, local_dir=f'composer_models/{local_name}')\""
                ]
            }
        }
    ]
}