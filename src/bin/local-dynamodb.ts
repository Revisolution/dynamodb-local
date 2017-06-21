#!/usr/bin/env node
import LocalDynamo from '../'

const dynamodb = new LocalDynamo()
dynamodb
  .installAndStart()
