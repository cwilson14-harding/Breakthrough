import { NgModule } from '@angular/core';
import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BoardService } from './board.service';

describe('BoardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BoardService]
    });
  });

  it('should be created', inject([BoardService], (service: BoardService) => {
    expect(service).toBeTruthy();
  }));
});
