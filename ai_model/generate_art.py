"""
===============================================================================
THE JOURNEY TO HER ❤️ - GENERATIVE AI ART PIPELINE
College Assignment Module: Text-to-Image Generation with PyTorch & Diffusers
===============================================================================

This module uses PyTorch and Hugging Face Diffusers (Latent Diffusion Models)
to generate high-quality stylized environment textures for the 3D browser game.

Supported Models:
- SD-Turbo (1-step real-time inference, fast for local laptops)
- Stable Diffusion v1.5 (Standard high-fidelity text-to-image)

Usage:
    python generate_art.py --theme forest
    python generate_art.py --theme sunset
    python generate_art.py --theme destination
    python generate_art.py --theme all
    python generate_art.py --prompt "Your custom prompt here" --output_name custom_bg.jpg
===============================================================================
"""

import os
import sys
import argparse
from pathlib import Path

# Preset prompts tailored for the game's 3 story chapters
THEME_PROMPTS = {
    "forest": (
        "A colorful, family-friendly 3D fantasy game environment with a peaceful forest path, "
        "glowing golden coins, vibrant green trees, warm sunlight rays, blooming wildflowers, "
        "and a magical adventurous atmosphere. Panoramic stylized cartoon game art, high resolution, "
        "no text, no watermark."
    ),
    "sunset": (
        "A romantic golden sunset garden with warm amber, coral and lavender twilight sky, "
        "glowing fairy lanterns hanging from willows, vibrant blooming rose bushes, stone walkway, "
        "distant sparkling fairytale hills, stylized 3D animation game art, magical and dreamy atmosphere, "
        "no text, no watermark."
    ),
    "destination": (
        "A romantic fantasy destination scene with an ornate white floral gazebo in a magical "
        "blooming garden, cherry blossom petals floating gently in the air, warm golden sunset glow, "
        "glowing heart-shaped sparkles, distant fairytale palace, stylized 3D game cinematic backdrop, "
        "whimsical and heartwarming, high quality, no text, no watermark."
    )
}

TARGET_FILENAMES = {
    "forest": "magical_forest_path.jpg",
    "sunset": "golden_sunset_garden.jpg",
    "destination": "fantasy_destination_scene.jpg"
}


def generate_with_diffusion(prompt: str, output_path: Path, model_id: str = "stabilityai/sd-turbo", steps: int = 4, device: str = None):
    """
    Executes Text-to-Image generation using PyTorch and Hugging Face diffusers.
    """
    print(f"\n[AI-Pipeline] Initializing Latent Diffusion Model: '{model_id}'...")

    try:
        import torch
        from diffusers import AutoPipelineForText2Image
        from PIL import Image
    except ImportError:
        print("\n[ERROR] Required packages not found!")
        print("Please install requirements using:")
        print("    pip install -r requirements.txt")
        print("\nFalling back to procedural synthesis mode for immediate testing...")
        return generate_procedural_fallback(prompt, output_path)

    # Determine hardware device (CUDA GPU vs CPU)
    if device is None:
        device = "cuda" if torch.cuda.is_available() else "cpu"

    print(f"[AI-Pipeline] Target compute device: {device.upper()}")
    if device == "cuda":
        print(f"[AI-Pipeline] Detected GPU: {torch.cuda.get_device_name(0)}")

    dtype = torch.float16 if device == "cuda" else torch.float32

    try:
        pipe = AutoPipelineForText2Image.from_pretrained(
            model_id,
            torch_dtype=dtype,
            variant="fp16" if device == "cuda" else None
        )
        pipe.to(device)

        print(f"[AI-Pipeline] Synthesizing image from prompt:")
        print(f'              "{prompt}"')
        print(f"[AI-Pipeline] Denoising steps: {steps}...")

        # Run Latent Diffusion inference
        generator = torch.manual_seed(42)
        image = pipe(
            prompt=prompt,
            num_inference_steps=steps,
            guidance_scale=0.0 if "turbo" in model_id.lower() else 7.5,
            generator=generator
        ).images[0]

        # Save to output
        output_path.parent.mkdir(parents=True, exist_ok=True)
        image.save(output_path, quality=95)
        print(f"[SUCCESS] Generated artwork saved to: {output_path.resolve()}")
        return True

    except Exception as e:
        print(f"[WARNING] Diffusion inference encountered an error: {e}")
        print("Falling back to procedural preview generation...")
        return generate_procedural_fallback(prompt, output_path)


def generate_procedural_fallback(prompt: str, output_path: Path):
    """
    Lightweight fallback that uses Pillow to mathematically generate a high-res
    color palette and gradient horizon for testing when PyTorch GPU/weights are not ready.
    """
    try:
        from PIL import Image, ImageDraw, ImageFont
    except ImportError:
        print("[ERROR] Pillow (PIL) is required. Install via: pip install Pillow")
        return False

    width, height = 1280, 720
    img = Image.new("RGB", (width, height), (30, 41, 59))
    draw = ImageDraw.Draw(img)

    # Sky gradient
    for y in range(height):
        ratio = y / height
        if "sunset" in prompt.lower():
            r = int(251 * (1 - ratio) + 244 * ratio)
            g = int(146 * (1 - ratio) + 63 * ratio)
            b = int(60 * (1 - ratio) + 94 * ratio)
        elif "destination" in prompt.lower():
            r = int(244 * (1 - ratio) + 219 * ratio)
            g = int(114 * (1 - ratio) + 39 * ratio)
            b = int(182 * (1 - ratio) + 119 * ratio)
        else: # Forest
            r = int(135 * (1 - ratio) + 46 * ratio)
            g = int(206 * (1 - ratio) + 196 * ratio)
            b = int(235 * (1 - ratio) + 182 * ratio)
        draw.line([(0, y), (width, y)], fill=(r, g, b))

    # Sun / Moon disc
    draw.ellipse([width * 0.45, height * 0.15, width * 0.55, height * 0.35], fill=(255, 243, 176))

    # Mountains silhouette
    mountain_points = [(0, height * 0.75)]
    for x in range(0, width + 50, 50):
        h = height * 0.6 + ((x * 17) % 70)
        mountain_points.append((x, h))
    mountain_points.append((width, height))
    mountain_points.append((0, height))
    draw.polygon(mountain_points, fill=(20, 30, 45))

    output_path.parent.mkdir(parents=True, exist_ok=True)
    img.save(output_path, quality=95)
    print(f"[FALLBACK] Synthesized gradient backdrop saved to: {output_path.resolve()}")
    return True


def main():
    parser = argparse.ArgumentParser(description="The Journey to Her - Generative AI Art Generator")
    parser.add_argument("--theme", choices=["forest", "sunset", "destination", "all"], default="forest",
                        help="Pre-configured theme to generate (default: forest)")
    parser.add_argument("--prompt", type=str, default=None,
                        help="Custom text prompt (overrides preset theme prompt)")
    parser.add_argument("--output_name", type=str, default=None,
                        help="Custom output image filename")
    parser.add_argument("--model", type=str, default="stabilityai/sd-turbo",
                        help="Hugging Face model ID (default: stabilityai/sd-turbo)")
    parser.add_argument("--steps", type=int, default=4,
                        help="Number of denoising inference steps (default: 4 for sd-turbo)")
    parser.add_argument("--cpu", action="store_true",
                        help="Force CPU execution instead of CUDA GPU")

    args = parser.parse_args()

    project_root = Path(__file__).resolve().parent.parent
    assets_generated = project_root / "assets" / "generated"
    assets_images = project_root / "assets" / "images"

    device = "cpu" if args.cpu else None

    # Handle custom prompt
    if args.prompt:
        out_name = args.output_name if args.output_name else "custom_generated.jpg"
        target_path = assets_generated / out_name
        generate_with_diffusion(args.prompt, target_path, model_id=args.model, steps=args.steps, device=device)
        return

    # Handle themes
    themes_to_run = ["forest", "sunset", "destination"] if args.theme == "all" else [args.theme]

    for theme in themes_to_run:
        prompt = THEME_PROMPTS[theme]
        filename = TARGET_FILENAMES[theme]
        target_path_gen = assets_generated / filename
        target_path_img = assets_images / filename

        print(f"\n=======================================================")
        print(f" Generating Theme: [{theme.upper()}]")
        print(f"=======================================================")
        generate_with_diffusion(prompt, target_path_gen, model_id=args.model, steps=args.steps, device=device)

        # Synchronize with assets/images so game can pick it up immediately
        try:
            import shutil
            shutil.copy2(target_path_gen, target_path_img)
            print(f"[SYNC] Synced to game assets: {target_path_img.name}")
        except Exception as e:
            pass


if __name__ == "__main__":
    main()
