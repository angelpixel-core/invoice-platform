#!/usr/bin/env sh

awslocal sqs create-queue \
  --queue-name invoice-events-dlq

awslocal sqs create-queue \
  --queue-name invoice-events \
  --attributes '{"RedrivePolicy":"{\"deadLetterTargetArn\":\"arn:aws:sqs:us-east-1:000000000000:invoice-events-dlq\",\"maxReceiveCount\":5}"}'
