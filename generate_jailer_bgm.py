import wave
import struct
import math
import random
import os

def create_jailer_bgm():
    sample_rate = 44100
    bpm = 132
    beat_dur = 60.0 / bpm          # ~0.4545s per beat
    sixteenth_dur = beat_dur / 4.0 # ~0.1136s
    
    # 24 bars of 4 beats = 96 beats = ~43.6 seconds (seamless loop)
    total_beats = 96
    total_duration = total_beats * beat_dur
    total_samples = int(total_duration * sample_rate)
    
    # Audio buffers: Left and Right channels (floating point)
    left = [0.0] * total_samples
    right = [0.0] * total_samples
    
    # Note frequencies (Hz)
    N = {
        'C2': 65.41, 'Cs2': 69.30, 'D2': 73.42, 'Eb2': 77.78, 'E2': 82.41, 'F2': 87.31, 'G2': 98.00, 'A2': 110.00,
        'C3': 130.81, 'Cs3': 138.59, 'D3': 146.83, 'Eb3': 155.56, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'Gs3': 207.65, 'A3': 220.00, 'Bb3': 233.08, 'C4': 261.63,
        'Cs4': 277.18, 'D4': 293.66, 'Eb4': 311.13, 'E4': 329.63, 'F4': 349.23, 'Fs4': 369.99, 'G4': 392.00, 'Gs4': 415.30, 'A4': 440.00, 'Bb4': 466.16, 'B4': 493.88,
        'C5': 523.25, 'Cs5': 554.37, 'D5': 587.33, 'Eb5': 622.25, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00,
        'REST': 0
    }

    # Helper: Add sound to buffer
    def add_sound(start_time, dur, gen_fn, gain=1.0, pan=0.0):
        start_idx = int(start_time * sample_rate)
        num_samples = int(dur * sample_rate)
        pan_l = math.cos((pan + 1.0) * math.pi / 4.0)
        pan_r = math.sin((pan + 1.0) * math.pi / 4.0)
        
        for i in range(num_samples):
            idx = start_idx + i
            if idx >= total_samples:
                break
            t = i / sample_rate
            val = gen_fn(t) * gain
            left[idx] += val * pan_l
            right[idx] += val * pan_r

    # --- 1. DRUMS (Kick, Snare, Trap Hi-Hats, Crashes) ---
    def kick_fn(t):
        if t > 0.35: return 0.0
        # Pitch drop from 150Hz to 42Hz
        f = 42.0 + 108.0 * math.exp(-t * 22.0)
        phase = 2.0 * math.pi * f * t
        env = math.exp(-t * 8.5)
        # Add slight sub-bass punch and saturation
        val = math.sin(phase) + 0.3 * math.sin(phase * 2.0)
        return math.tanh(val * 1.5) * env

    def snare_fn(t):
        if t > 0.28: return 0.0
        env = math.exp(-t * 16.0)
        noise = (random.random() * 2.0 - 1.0) * env
        body = math.sin(2.0 * math.pi * 185.0 * t) * math.exp(-t * 25.0)
        return (noise * 0.75 + body * 0.45)

    def hihat_fn(t):
        if t > 0.06: return 0.0
        env = math.exp(-t * 60.0)
        noise = (random.random() * 2.0 - 1.0) * env
        # High metallic ringing
        ring = math.sin(2.0 * math.pi * 7500.0 * t) * 0.3 * env
        return (noise + ring) * 0.5

    def crash_fn(t):
        if t > 2.2: return 0.0
        env = math.exp(-t * 2.2)
        noise = (random.random() * 2.0 - 1.0) * env
        ring = (math.sin(2.0 * math.pi * 4200.0 * t) + math.sin(2.0 * math.pi * 6100.0 * t)) * 0.2 * env
        return (noise + ring) * 0.6

    # Schedule Drums across 24 bars
    for bar in range(24):
        bar_start = bar * 4 * beat_dur
        
        # Crash on key section drops
        if bar in [0, 8, 16]:
            add_sound(bar_start, 2.2, crash_fn, gain=0.6, pan=0.1)

        # Kicks: Heavy driving syncopated Anirudh rhythm
        kick_beats = [0.0, 1.5, 2.0, 3.25] if bar % 2 == 1 else [0.0, 1.75, 2.5, 3.0]
        for kb in kick_beats:
            add_sound(bar_start + kb * beat_dur, 0.35, kick_fn, gain=0.85, pan=0.0)

        # Snares: On beats 1 and 3 (or 2 and 4 in standard time)
        add_sound(bar_start + 1.0 * beat_dur, 0.28, snare_fn, gain=0.75, pan=-0.05)
        add_sound(bar_start + 3.0 * beat_dur, 0.28, snare_fn, gain=0.75, pan=0.05)

        # Hi-Hats: 16th notes with trap rolls
        for s in range(16):
            t_offset = s * sixteenth_dur
            vol = 0.4 if s % 4 == 0 else (0.28 if s % 2 == 0 else 0.18)
            # Add trap rolls on 4th bar
            if bar % 4 == 3 and s in [12, 13, 14, 15]:
                add_sound(bar_start + t_offset, 0.05, hihat_fn, gain=0.35, pan=(s % 2)*0.3 - 0.15)
                add_sound(bar_start + t_offset + sixteenth_dur/2.0, 0.05, hihat_fn, gain=0.32, pan=(s % 2)*0.3 - 0.15)
            else:
                add_sound(bar_start + t_offset, 0.06, hihat_fn, gain=vol, pan=((s % 4) - 1.5) * 0.2)

    # --- 2. HEAVY DISTORTED SUB-BASS (D-Minor Driving Groove) ---
    def bass_note_fn(freq, duration):
        def fn(t):
            if t > duration: return 0.0
            env = min(1.0, t / 0.015) * math.exp(-t * (1.2 / duration))
            # Multi-oscillator: Fundamental sine + saw + octaves for grit
            val = math.sin(2.0 * math.pi * freq * t) * 0.6
            val += (2.0 * ((freq * t) % 1.0) - 1.0) * 0.35
            val += math.sin(2.0 * math.pi * (freq * 2.0) * t) * 0.25
            # Tube saturation / overdrive
            dist = math.tanh(val * 2.2)
            return dist * env
        return fn

    # Bass Patterns per bar
    # D-minor mass bassline: D2 ... D2 ... F2 ... G2 ... D2 ... C2 Cs2 D2
    bass_patterns = [
        # (beat_offset, dur_beats, note)
        (0.0, 0.75, 'D2'), (0.75, 0.75, 'D2'), (1.5, 0.5, 'D2'), (2.0, 0.75, 'F2'), (2.75, 0.5, 'G2'), (3.25, 0.75, 'D2'),
        (0.0, 0.75, 'D2'), (0.75, 0.75, 'D2'), (1.5, 0.5, 'D2'), (2.0, 0.75, 'C2'), (2.75, 0.5, 'Cs2'), (3.25, 0.75, 'D2')
    ]

    for bar in range(24):
        bar_start = bar * 4 * beat_dur
        pat_idx = bar % 2
        active_pat = bass_patterns[0:6] if pat_idx == 0 else bass_patterns[6:12]
        for bo, bd, note in active_pat:
            freq = N[note]
            dur_sec = bd * beat_dur
            add_sound(bar_start + bo * beat_dur, dur_sec, bass_note_fn(freq, dur_sec), gain=0.68, pan=0.0)

    # --- 3. THE ICONIC JAILER 2 / HUKUM BRASS THEME MELODY ---
    # Multi-saw brass horn sound with stereo detune
    def brass_horn_fn(freq, duration, pan_offset=0.0):
        def fn(t):
            if t > duration: return 0.0
            # Brass envelope: fast punchy attack, sustained body, decay
            attack = 0.02
            env = (t / attack) if t < attack else math.exp(-(t - attack) * (0.8 / duration))
            # Detuned saw oscillators for massive cinematic brass feel
            saw1 = 2.0 * ((freq * 0.997 * t) % 1.0) - 1.0
            saw2 = 2.0 * ((freq * 1.003 * t) % 1.0) - 1.0
            saw3 = 2.0 * ((freq * 0.5 * t) % 1.0) - 1.0 # Sub octave
            tri = math.sin(2.0 * math.pi * freq * t)
            raw = (saw1 * 0.35 + saw2 * 0.35 + saw3 * 0.2 + tri * 0.3)
            # Soft clip brass saturation
            return math.tanh(raw * 1.8) * env
        return fn

    # Jailer Theme / Hukum Iconic Motif Phrases:
    # Phrase 1: D4, D4, D4, F4, G4, F4, D4 (Punchy Hukum Motif)
    p1 = [
        (0.0, 0.35, 'D4'), (0.5, 0.35, 'D4'), (1.0, 0.35, 'D4'),
        (1.5, 0.45, 'F4'), (2.0, 0.85, 'G4'), (3.0, 0.45, 'F4'), (3.5, 0.45, 'D4')
    ]
    # Phrase 2: D4, D4, D4, F4, G4, G#4, A4 (Dramatic Rising Climax!)
    p2 = [
        (0.0, 0.35, 'D4'), (0.5, 0.35, 'D4'), (1.0, 0.35, 'D4'),
        (1.5, 0.45, 'F4'), (2.0, 0.45, 'G4'), (2.5, 0.45, 'Gs4'), (3.0, 1.0, 'A4')
    ]
    # Phrase 3: A4, G4, F4, G4, F4, D4, C4, D4 (Staccato Gunfire Brass Stabs!)
    p3 = [
        (0.0, 0.45, 'A4'), (0.5, 0.45, 'G4'), (1.0, 0.45, 'F4'), (1.5, 0.45, 'G4'),
        (2.0, 0.45, 'F4'), (2.5, 0.45, 'D4'), (3.0, 0.45, 'C4'), (3.5, 0.5, 'D4')
    ]
    # Phrase 4: D4, F4, G4, A4, C5, A4, G4, F4, D4 (Triumphant High Hook!)
    p4 = [
        (0.0, 0.4, 'D4'), (0.5, 0.4, 'F4'), (1.0, 0.4, 'G4'), (1.5, 0.4, 'A4'),
        (2.0, 0.6, 'C5'), (2.75, 0.4, 'A4'), (3.25, 0.35, 'G4'), (3.6, 0.4, 'D4')
    ]

    melody_sections = [
        (0, p1), (1, p2), (2, p3), (3, p4),
        (4, p1), (5, p2), (6, p3), (7, p4),
        # Second cycle with octave harmonization
        (8, p1), (9, p2), (10, p3), (11, p4),
        (12, p1), (13, p2), (14, p3), (15, p4),
        (16, p1), (17, p2), (18, p3), (19, p4),
        (20, p1), (21, p2), (22, p3), (23, p4),
    ]

    for bar_idx, phrase in melody_sections:
        bar_start = bar_idx * 4 * beat_dur
        for bo, bd, note in phrase:
            freq = N[note]
            dur_sec = bd * beat_dur
            # Center brass
            add_sound(bar_start + bo * beat_dur, dur_sec, brass_horn_fn(freq, dur_sec), gain=0.62, pan=0.0)
            # Wide stereo side brass
            add_sound(bar_start + bo * beat_dur, dur_sec, brass_horn_fn(freq * 1.002, dur_sec), gain=0.35, pan=-0.45)
            add_sound(bar_start + bo * beat_dur, dur_sec, brass_horn_fn(freq * 0.998, dur_sec), gain=0.35, pan=0.45)
            # High energy sections: add octave above
            if bar_idx >= 8:
                high_note = note.replace('3', '4').replace('4', '5').replace('5', '5')
                if high_note in N and N[high_note] > 0:
                    add_sound(bar_start + bo * beat_dur, dur_sec, brass_horn_fn(N[high_note], dur_sec), gain=0.32, pan=0.25)

    # --- 4. NORMALIZE & EXPORT 16-BIT STEREO WAV ---
    max_amp = 0.0001
    for i in range(total_samples):
        al = abs(left[i])
        ar = abs(right[i])
        if al > max_amp: max_amp = al
        if ar > max_amp: max_amp = ar

    norm_factor = 0.92 / max_amp if max_amp > 0 else 1.0
    print(f"Peak amplitude: {max_amp:.3f}, Normalization factor: {norm_factor:.3f}")

    os.makedirs('assets/audio', exist_ok=True)
    out_path = 'assets/audio/jailer_bgm.wav'

    with wave.open(out_path, 'w') as wav_file:
        wav_file.setnchannels(2)      # Stereo
        wav_file.setsampwidth(2)      # 16-bit
        wav_file.setframerate(sample_rate)
        
        frames = bytearray()
        for i in range(total_samples):
            l_val = int(max(-32767, min(32767, left[i] * norm_factor * 32767.0)))
            r_val = int(max(-32767, min(32767, right[i] * norm_factor * 32767.0)))
            frames.extend(struct.pack('<hh', l_val, r_val))
        
        wav_file.writeframes(frames)
    
    print(f"Successfully generated Jailer 2 Theme audio at: {out_path} ({total_duration:.2f}s)")

if __name__ == '__main__':
    create_jailer_bgm()
