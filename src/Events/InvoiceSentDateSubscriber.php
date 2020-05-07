<?php

namespace App\Events;

use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Invoice;
use App\Repository\InvoiceRepository;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class InvoiceSentDateSubscriber implements EventSubscriberInterface
{
    private $repo;

    public function __construct(InvoiceRepository $repo)
    {
        $this->repo = $repo;
    }

    public static function getSubscribedEvents()
    {
        return [KernelEvents::VIEW=>['setSentAtForInvoice', EventPriorities::PRE_VALIDATE]];
    }

    public function setSentAtForInvoice(ViewEvent $event)
    {
        $result = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if ($result instanceof Invoice && $method === "POST"){
            $result->setSentAt(new \DateTime());
        }
    }
}