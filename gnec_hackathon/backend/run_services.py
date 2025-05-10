"""
Script to run both the NestJS backend and the ASL Recognition service.
"""
import os
import subprocess
import sys
import platform
import time
import signal
import threading

# Global variables to keep track of processes
backend_process = None
asl_service_process = None
terminate_event = threading.Event()

def run_command(command, cwd=None):
    """Run a command and return the process."""
    system = platform.system()
    
    if system == 'Windows':
        # For Windows, use shell=True to run npm commands
        process = subprocess.Popen(
            command,
            cwd=cwd,
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            universal_newlines=True,
            creationflags=subprocess.CREATE_NEW_PROCESS_GROUP
        )
    else:
        # For Unix-based systems
        process = subprocess.Popen(
            command,
            cwd=cwd,
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            universal_newlines=True,
            preexec_fn=os.setsid
        )
    
    return process

def print_output(process, prefix):
    """Print the output of a process with a prefix."""
    for line in process.stdout:
        if terminate_event.is_set():
            break
        print(f"{prefix}: {line.strip()}")

def start_backend():
    """Start the NestJS backend."""
    global backend_process
    
    print("Starting NestJS backend...")
    backend_process = run_command("npm run start:dev", cwd=".")
    
    # Start a thread to print the output
    threading.Thread(
        target=print_output,
        args=(backend_process, "BACKEND"),
        daemon=True
    ).start()
    
    print("NestJS backend started.")

def start_asl_service():
    """Start the ASL Recognition service."""
    global asl_service_process
    
    print("Starting ASL Recognition service...")
    
    # Determine Python command based on the platform
    python_cmd = "python" if platform.system() == "Windows" else "python3"
    
    asl_service_process = run_command(
        f"{python_cmd} run.py",
        cwd="./asl-service"
    )
    
    # Start a thread to print the output
    threading.Thread(
        target=print_output,
        args=(asl_service_process, "ASL SERVICE"),
        daemon=True
    ).start()
    
    print("ASL Recognition service started.")

def cleanup():
    """Clean up and terminate all processes."""
    global backend_process, asl_service_process
    
    terminate_event.set()
    
    print("Stopping services...")
    
    if backend_process:
        try:
            if platform.system() == "Windows":
                # Windows specific termination
                backend_process.send_signal(signal.CTRL_BREAK_EVENT)
            else:
                # Unix specific termination
                os.killpg(os.getpgid(backend_process.pid), signal.SIGTERM)
            print("Backend process terminated.")
        except Exception as e:
            print(f"Error terminating backend process: {e}")
    
    if asl_service_process:
        try:
            if platform.system() == "Windows":
                # Windows specific termination
                asl_service_process.send_signal(signal.CTRL_BREAK_EVENT)
            else:
                # Unix specific termination
                os.killpg(os.getpgid(asl_service_process.pid), signal.SIGTERM)
            print("ASL service process terminated.")
        except Exception as e:
            print(f"Error terminating ASL service process: {e}")
    
    print("All services stopped.")

def main():
    """Main entry point."""
    print("Starting all services...")
    
    try:
        # Start both services
        start_backend()
        start_asl_service()
        
        print("\nAll services are running. Press Ctrl+C to stop.\n")
        
        # Keep the main thread running
        while True:
            time.sleep(1)
    
    except KeyboardInterrupt:
        print("\nReceived interrupt signal.")
    finally:
        cleanup()

if __name__ == "__main__":
    main() 