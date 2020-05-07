<?php

namespace App\Events;

use App\Entity\Customer;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use ApiPlatform\Core\EventListener\EventPriorities;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class CustomerUserSubscriber implements EventSubscriberInterface
{
    private $security;

    public function __construct(Security $security)
    {
        $this->security = $security;
    }
 
    public static function getSubscribedEvents()
    {
        return [KernelEvents::VIEW=>['setUserForCustomer', EventPriorities::PRE_VALIDATE]];
    }

    public function setUserForCustomer(ViewEvent $event)
    {
        $result = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        // L'attribution d'un user à un customer n'intervient que pour la méthode POST et l'entité Customer
        if ($result instanceof Customer && $method === "POST"){
            $result->setUser($this->security->getUser());
        }

    }

}