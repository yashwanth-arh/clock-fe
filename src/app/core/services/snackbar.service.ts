import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HotToastService, ToastPosition } from '@ngneat/hot-toast';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  showSuccessSnackbar(showSuccessSnackbar: any) {
    throw new Error('Method not implemented.');
  }
  public position: ToastPosition;
  letter: boolean;
  number: boolean;
  special: boolean;
  char_nos: boolean;
  lettersRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#~^_(){}\[\]\\:;'",.<>\/=+`|,-])[\\\]?[A-Za-z\d@$!%*?&#~^_(){}\[\]\\:;'",.<>\/=+`|,-_]{8,15}$/g;

  specialCharRegex = /[\s\S]*/;
  numbersRegex = /[0-9]/g;
  validRegex: boolean;
  validRegexRenew: boolean;
  constructor(private snackBar: MatSnackBar, private toast: HotToastService) {
    this.position = 'top-right';
  }

  /*
  It takes three parameters
      1.the message string
      2.the action
      3.the duration, alignment, etc.
  */

  public openSnackBar(
    message: string,
    action = 'close',
    duration = 2000
  ): void {
    this.snackBar.open(message, action, {
      duration,
    });
  }

  public success(message: string, duration = 2000): void {
    this.toast.success(message, {
      duration,
      position: this.position,
      dismissible: true,
      autoClose: true,
      role: 'alert',
      ariaLive: 'polite',
      theme: 'toast',
      iconTheme: {
        secondary: '#34A853',
        primary: '#FFFAEE',
      },
      style: {
        border: '1px solid #34A853',
        padding: '16px',
        color: '#FFFAEE',
        backgroundColor: '#34A853',
      },
    });
  }
  public error(message: string, duration = 4000): void {
    this.toast.error(message, {
      duration,
      position: this.position,
      dismissible: true,
      autoClose: true,
      role: 'alert',
      ariaLive: 'polite',
      theme: 'toast',
      iconTheme: {
        secondary: '#EA4335',
        primary: '#FFFAEE',
      },
      style: {
        border: '1px solid #EA4335',
        padding: '16px',
        color: '#FFFAEE',
        backgroundColor: '#EA4335',
      },
    });
  }
  public info(message: string, duration = 2000): void {
    this.toast.warning(message, {
      duration,
      position: this.position,
      dismissible: true,
      autoClose: true,
      role: 'alert',
      ariaLive: 'polite',
      theme: 'toast',
      iconTheme: {
        secondary: '#FBBC05',
        primary: '#FFFAEE',
      },
      style: {
        border: '1px solid #FBBC05',
        padding: '16px',
        color: '#FFFAEE',
        backgroundColor: '#FBBC05',
        position: 'relative',
        bottom: '5vh',
        // z-index:''
      },
    });
  }

  public notify(title: string, body: string, duration = 2000): void {
    this.toast.show(
      `<strong>${title}</strong><br><p>${body.substring(0, 35)}..</p>`,
      {
        duration,
        position: this.position,
        dismissible: true,
        autoClose: true,
        role: 'alert',
        ariaLive: 'polite',
        theme: 'toast',
        iconTheme: {
          secondary: '#FBBC05',
          primary: '#FFFAEE',
        },
        style: {
          border: '1px solid #FBBC05',
          padding: '16px',
          color: '#FFFAEE',
          backgroundColor: '#FBBC05',
        },
      }
    );
  }

  public showMultiline(msgTitle: string, msg: string, duration = 3000): void {
    this.toast.show(msg, {
      duration,
      dismissible: true,
      autoClose: true,
      position: 'top-right',
      style: {
        border: '1px solid #2196F3',
        padding: '16px',
        color: '#FFFAEE',
        backgroundColor: '#2196F3',
      },
    });
  }

  text_change(evt, type) {
    if (this.lettersRegex.test(evt.target.value)) {
      this.letter = true;
    } else if (!this.lettersRegex.test(evt.target.value)) {
      this.letter = false;
    }

    if (this.numbersRegex.test(evt.target.value)) {
      this.number = true;
    } else if (!this.numbersRegex.test(evt.target.value)) {
      this.number = false;
    }

    if (this.specialCharRegex.test(evt.target.value)) {
      this.special = true;
    } else if (!this.specialCharRegex.test(evt.target.value)) {
      this.special = false;
    }

    if (evt.target.value.length >= 8 && evt.target.value.length <= 16) {
      this.char_nos = true;
    } else {
      this.char_nos = false;
    }
    if (type == 'new') {
      if (this.letter && this.number && this.special && this.char_nos) {
        this.validRegex = true;
      } else {
        this.validRegex = false;
      }
    } else {
      if (this.letter && this.number && this.special && this.char_nos) {
        this.validRegexRenew = true;
      } else {
        this.validRegexRenew = false;
      }
    }
  }
}
