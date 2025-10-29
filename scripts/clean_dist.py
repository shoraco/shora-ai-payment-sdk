#!/usr/bin/env python3
"""
Clean dist folder from OSS fork remnants
Remove files containing OSS project names
"""

import os
import shutil

def clean_dist_folder():
    dist_path = 'dist'
    if not os.path.exists(dist_path):
        print("Dist folder not found")
        return
    
    removed_files = []
    
    # Clean CommonJS dist
    for root, dirs, files in os.walk(dist_path):
        for file in files:
            if any(oss_name in file.lower() for oss_name in ['ap2', 'a2a']):
                file_path = os.path.join(root, file)
                try:
                    os.remove(file_path)
                    removed_files.append(file_path)
                    print(f"Removed: {file_path}")
                except Exception as e:
                    print(f"Error removing {file_path}: {e}")
    
    # Clean ESM dist
    esm_path = os.path.join(dist_path, 'esm')
    if os.path.exists(esm_path):
        for root, dirs, files in os.walk(esm_path):
            for file in files:
                if any(oss_name in file.lower() for oss_name in ['ap2', 'a2a']):
                    file_path = os.path.join(root, file)
                    try:
                        os.remove(file_path)
                        removed_files.append(file_path)
                        print(f"Removed: {file_path}")
                    except Exception as e:
                        print(f"Error removing {file_path}: {e}")
    
    print(f"\nCleaned {len(removed_files)} files from dist folder")
    return removed_files

if __name__ == "__main__":
    clean_dist_folder()
