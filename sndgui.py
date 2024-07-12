import os
import tkinter as tk
from tkinter import messagebox, filedialog
import re

def replace_in_file(file_path, old_string, new_string):
    try:
        with open(file_path, 'rb') as file:  # Open in binary mode
            file_content = file.read()
        
        # Perform binary replacement
        new_content = file_content.replace(old_string.encode(), new_string.encode())
        
        with open(file_path, 'wb') as file:  # Open in binary mode for writing
            file.write(new_content)
        
        return True
    
    except Exception as e:
        print(f"Error processing file {file_path}: {e}")
        return False

def search_files_containing_string(directory, search_string):
    files_found = []
    
    for dirpath, _, filenames in os.walk(directory):
        for filename in filenames:
            file_path = os.path.join(dirpath, filename)
            if os.path.isfile(file_path):
                try:
                    with open(file_path, 'rb') as file:  # Open in binary mode
                        file_content = file.read()
                    
                    # Check if search_string bytes exist in file_content bytes
                    if search_string.encode() in file_content:
                        files_found.append(file_path)
                
                except Exception as e:
                    print(f"Error reading file {file_path}: {e}")
    
    return files_found

# Other functions and GUI setup remain unchanged


def find_files_containing_string():
    search_string = entry_search.get()
    if not search_string:
        messagebox.showwarning("Warning", "Please enter a search string.")
        return
    
    cwd = os.getcwd()
    files_found = search_files_containing_string(cwd, search_string)
    
    if files_found:
        messagebox.showinfo("Files Found", f"Files containing '{search_string}':\n\n" + "\n".join(files_found))
    else:
        messagebox.showinfo("Files Found", f"No files found containing '{search_string}'.")

def change_files():
    old_string = entry_old.get()
    new_string = entry_new.get()
    
    if not old_string or not new_string:
        messagebox.showwarning("Warning", "Please enter both old and new strings.")
        return
    
    cwd = os.getcwd()
    for dirpath, _, filenames in os.walk(cwd):
        for filename in filenames:
            file_path = os.path.join(dirpath, filename)
            if os.path.isfile(file_path):
                if replace_in_file(file_path, old_string, new_string):
                    print(f"Modified file: {file_path}")

# Create the main window
root = tk.Tk()
root.title("File String Replacement Tool")

# Set background color
root.configure(bg='#7AC4C8')

# Create labels and entry widgets for old string, new string, and search string
tk.Label(root, text="Old String:", bg='#7AC4C8', fg='white').grid(row=0, column=0, padx=10, pady=5, sticky="w")
entry_old = tk.Entry(root, width=50)
entry_old.grid(row=0, column=1, padx=10, pady=5)

tk.Label(root, text="New String:", bg='#7AC4C8', fg='white').grid(row=1, column=0, padx=10, pady=5, sticky="w")
entry_new = tk.Entry(root, width=50)
entry_new.grid(row=1, column=1, padx=10, pady=5)

# Create buttons for Find and Change operations with custom styles
btn_find = tk.Button(root, text="Find", bg='#3E7D81', fg='white', bd=0, padx=20, pady=10, command=find_files_containing_string)
btn_find.grid(row=2, column=0, padx=10, pady=10)

btn_change = tk.Button(root, text="Change", bg='#3E7D81', fg='white', bd=0, padx=20, pady=10, command=change_files)
btn_change.grid(row=2, column=1, padx=10, pady=10)

# Run the main loop
root.mainloop()